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
import {UpdateProgressCallback, useUploadProgressTaskbar} from "./UploadProgressTaskbar";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";

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

export function useDiskDatastoreMigration() {

    const log = useLogger();
    const {persistenceLayerProvider} = usePersistenceLayerContext()
    const uploadProgressTaskbar = useUploadProgressTaskbar();

    return React.useCallback((opts: IMigration) => {

        const persistenceLayer = persistenceLayerProvider();

        type UploadHandler = (uploadProgress: UpdateProgressCallback) => Promise<void>;

        async function createDocMetaUploadHandler(docMetaProvider: DocMetaProvider): Promise<UploadHandler> {

            return async () => {
                const docMeta = await docMetaProvider()
                await persistenceLayer.writeDocMeta(docMeta);
            }

        }

        async function createStashFileRefUploadHandler(stashFileRef: StashFileRef): Promise<UploadHandler> {

            return async (uploadProgress) => {
                const blob = await stashFileRef.data();
                await persistenceLayer.writeFile(Backend.STASH, stashFileRef.ref, blob, {progressListener: uploadProgress});
            }

        }

        async function createImageFileRefUploadHandler(imageFileRef: ImageFileRef): Promise<UploadHandler>  {

            return async (uploadProgress) => {
                const blob = await imageFileRef.data();
                await persistenceLayer.writeFile(Backend.IMAGE, imageFileRef.ref, blob, {progressListener: uploadProgress});
            }

        }

        async function doAsync() {

            const docMetaUploadHandlers = await asyncStream(opts.docMetaProviders).map(createDocMetaUploadHandler).collect();
            const stashFileRefUploadHandlers = await asyncStream(opts.stashFileRefs).map(createStashFileRefUploadHandler).collect();
            const imageFileRefUploadHandlers = await asyncStream(opts.imageFileRefs).map(createImageFileRefUploadHandler).collect();

            const uploadHandlers = [...docMetaUploadHandlers, ...stashFileRefUploadHandlers, ...imageFileRefUploadHandlers];

            let idx = 0;
            for (const uploadHandler of uploadHandlers) {
                ++idx;
                const updateProgress = await uploadProgressTaskbar(idx, uploadHandlers.length);

                try {
                    uploadHandler(updateProgress);
                } finally {
                    updateProgress(100);
                }

            }

        }

        doAsync()
            .catch(err => log.error(err));

    }, [persistenceLayerProvider, log, uploadProgressTaskbar])

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
                       upload.path.startsWith(".polar/files/image/") &&
                       upload.path.endsWith(".png")
            }

            return uploads.filter(filter)
                         .map(toBaseFileRef)

        }

        function computeStashFileRefs(): ReadonlyArray<StashFileRef> {

            function filter(upload: IUpload) {
                return upload.path !== undefined &&
                       upload.path.startsWith(".polar/stash/") &&
                       upload.path.toLowerCase().endsWith(".pdf")
            }

            return uploads.filter(filter)
                        .map(toBaseFileRef)

        }

        function computeDocMetaProviders(): ReadonlyArray<DocMetaProvider> {

            function filter(upload: IUpload) {
                return upload.path !== undefined &&
                       upload.path.startsWith(".polar/") &&
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

        const required = docMetaProviders.length > 0;

        return {imageFileRefs, stashFileRefs, docMetaProviders, required};

    }

}
