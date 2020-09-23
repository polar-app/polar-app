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

interface IOpts {
    readonly docMetaProviders: ReadonlyArray<DocMetaProvider>;
    readonly stashFileRefs: ReadonlyArray<StashFileRef>;
    readonly imageFileRefs: ReadonlyArray<ImageFileRef>;
}

export function useDiskDatastoreMigration() {

    const log = useLogger();
    const {persistenceLayerProvider} = usePersistenceLayerContext()

    return React.useCallback((opts: IOpts) => {

        const persistenceLayer = persistenceLayerProvider();

        async function doDocMeta(docMetaProvider: DocMetaProvider) {
            const docMeta = await docMetaProvider()
            await persistenceLayer.writeDocMeta(docMeta);
        }

        async function doStashFileRef(stashFileRef: StashFileRef) {
            const blob = await stashFileRef.data();
            await persistenceLayer.writeFile(Backend.STASH, stashFileRef.ref, blob);
        }

        async function doImageFileRef(imageFileRef: ImageFileRef) {
            const blob = await imageFileRef.data();
            await persistenceLayer.writeFile(Backend.IMAGE, imageFileRef.ref, blob);
        }

        async function doAsync() {

            for (const docMetaProvider of opts.docMetaProviders) {
                await doDocMeta(docMetaProvider);
            }

            for (const stashFileRef of opts.stashFileRefs) {
                await doStashFileRef(stashFileRef);
            }

            for (const imageFileRef of opts.imageFileRefs) {
                await doImageFileRef(imageFileRef);
            }

        }

        doAsync()
            .catch(err => log.error(err));

    }, [persistenceLayerProvider, log])

}

export namespace DiskDatastoreMigrations {

    export function prepare(uploads: ReadonlyArray<IUpload>) {

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

        return {imageFileRefs, stashFileRefs, docMetaProviders};

    }

}
