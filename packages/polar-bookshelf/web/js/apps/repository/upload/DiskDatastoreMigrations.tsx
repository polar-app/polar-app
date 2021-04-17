import React from 'react';
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useLogger} from "../../../mui/MUILogger";
import {AsyncProvider} from "polar-shared/src/util/Providers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Backend} from "polar-shared/src/datastore/Backend";
import { FileRef } from 'polar-shared/src/datastore/FileRef';
import {Paths} from "polar-shared/src/util/Paths";
import {Blobs} from "polar-shared/src/util/Blobs";
import {DocMetas} from "../../../metadata/DocMetas";
import {IUpload} from "./IUpload";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";
import {UploadHandler, useBatchUploader} from './UploadHandlers';

type BlobProvider = () => Promise<Blob>;

interface BaseFileRef {
    readonly ref: FileRef;
    readonly data: BlobProvider;
}

interface ImageFileRef extends BaseFileRef {
}

interface StashFileRef extends BaseFileRef {
}

type DocMetaProvider = AsyncProvider<IDocMeta>;

interface IMigration {
    readonly docMetaProviders: ReadonlyArray<DocMetaProvider>;
    readonly stashFileRefs: ReadonlyArray<StashFileRef>;
    readonly imageFileRefs: ReadonlyArray<ImageFileRef>;

    /**
     * True if the migration is required.
     */
    readonly required: boolean;

}

function useDiskDatastoreMigrationExecutor() {

    const log = useLogger();
    const {persistenceLayerProvider} = usePersistenceLayerContext()
    const batchUploader = useBatchUploader();

    return React.useCallback((opts: IMigration) => {

        const persistenceLayer = persistenceLayerProvider();

        async function createDocMetaUploadHandler(docMetaProvider: DocMetaProvider): Promise<UploadHandler<void>> {

            return async () => {
                const docMeta = await docMetaProvider()
                await persistenceLayer.writeDocMeta(docMeta);
            }

        }

        async function createStashFileRefUploadHandler(stashFileRef: StashFileRef): Promise<UploadHandler<void>> {

            return async (uploadProgress, onController) => {
                const blob = await stashFileRef.data();
                await persistenceLayer.writeFile(Backend.STASH, stashFileRef.ref, blob, {progressListener: uploadProgress, onController});
            }

        }

        async function createImageFileRefUploadHandler(imageFileRef: ImageFileRef): Promise<UploadHandler<void>>  {

            return async (uploadProgress, onController) => {
                const blob = await imageFileRef.data();
                await persistenceLayer.writeFile(Backend.IMAGE, imageFileRef.ref, blob, {progressListener: uploadProgress, onController});
            }

        }

        async function doAsync() {

            const docMetaUploadHandlers = await asyncStream(opts.docMetaProviders).map(createDocMetaUploadHandler).collect();
            const stashFileRefUploadHandlers = await asyncStream(opts.stashFileRefs).map(createStashFileRefUploadHandler).collect();
            const imageFileRefUploadHandlers = await asyncStream(opts.imageFileRefs).map(createImageFileRefUploadHandler).collect();

            const uploadHandlers = [...docMetaUploadHandlers, ...stashFileRefUploadHandlers, ...imageFileRefUploadHandlers];

            return await batchUploader(uploadHandlers);

        }

        doAsync()
            .catch(err => log.error(err));

    }, [persistenceLayerProvider, log, batchUploader])


}


export function useDiskDatastoreMigration() {

    const diskDatastoreMigrationExecutor = useDiskDatastoreMigrationExecutor();
    const dialogManager = useDialogManager();

    return React.useCallback((opts: IMigration) => {

        dialogManager.confirm({
            title: "Migrate Polar 1.0 Data?",
            type: 'info',
            subtitle: (
                <div>
                    <p>
                        Looks like you're migrating data from Polar 1.0.
                    </p>
                    <p>
                        This migration tool will migrate all of your data including documents and annotations from
                        Polar 1.0.
                    </p>
                </div>
            ),
            onAccept: () => diskDatastoreMigrationExecutor(opts)
        })

    }, [diskDatastoreMigrationExecutor, dialogManager]);

}

export namespace DiskDatastoreMigrations {

    export function prepare(uploads: ReadonlyArray<IUpload>): IMigration {

        function toBaseFileRef(upload: IUpload): BaseFileRef {
            const name = Paths.basename(upload.path!);
            return {
                ref: {
                    name
                },
                data: upload.blob
            };
        }


        function computeImageFileRefs(): ReadonlyArray<ImageFileRef> {

            function filter(upload: IUpload) {
                return upload.path !== undefined &&
                       upload.path.match(/^\/?\.polar\/files\/image\//) &&
                       upload.path.endsWith(".png")
            }

            return uploads.filter(filter)
                         .map(toBaseFileRef)

        }

        function computeStashFileRefs(): ReadonlyArray<StashFileRef> {

            function filter(upload: IUpload) {
                return upload.path !== undefined &&
                       upload.path.match(/^\/?\.polar\/stash\//) &&
                       upload.path.toLowerCase().endsWith(".pdf")
            }

            return uploads.filter(filter)
                          .map(toBaseFileRef)

        }

        function computeDocMetaProviders(): ReadonlyArray<DocMetaProvider> {

            function filter(upload: IUpload) {
                return upload.path !== undefined &&
                       upload.path.match(/^\/?\.polar\//) &&
                       upload.path.toLowerCase().endsWith("/state.json");
            }

            function toDocMetaProvider(upload: IUpload) {

                return async (): Promise<IDocMeta> => {

                    function computeFingerprint() {
                        const parts = upload.path!.split('/')
                        return parts[parts.length - 1];
                    }

                    const fingerprint = computeFingerprint();
                    const blob = await upload.blob();
                    const json = await Blobs.toText(blob);

                    return DocMetas.deserialize(json, fingerprint);
                }


            }

            return uploads.filter(filter)
                          .map(toDocMetaProvider)

        }

        const imageFileRefs = computeImageFileRefs();
        const stashFileRefs = computeStashFileRefs();
        const docMetaProviders = computeDocMetaProviders();

        console.log(`Found ${imageFileRefs.length} image files, ${stashFileRefs.length} stash files, and ${docMetaProviders.length} docMeta files.`);

        const required = docMetaProviders.length > 0;

        return {imageFileRefs, stashFileRefs, docMetaProviders, required};

    }

}
