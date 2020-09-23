import React from 'react';
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useLogger} from "../../../mui/MUILogger";
import {AsyncProvider, Provider} from "polar-shared/src/util/Providers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Backend} from "polar-shared/src/datastore/Backend";
import { FileRef } from 'polar-shared/src/datastore/FileRef';
import {Paths} from "polar-shared/src/util/Paths";
import {Blobs} from "polar-shared/src/util/Blobs";
import {DocMetas} from "../../../metadata/DocMetas";
import {IWebkitFileSystem} from "./IWebkitFileSystem";
import {FileSystemFileEntries} from "./FileSystemFileEntries";

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

    import IWebkitFileSystemFileEntry = IWebkitFileSystem.IWebkitFileSystemFileEntry;

    interface IFile {
        readonly path: string;
        readonly data: BlobProvider;
    }

    /**
     * Prepare from standard files...
     */
    export function prepareFromFiles(files: ReadonlyArray<File>) {

        function toIFile(file: File): IFile {
            return {
                path: file.path,
                data: async () => file
            }
        }

        return prepare(files.map(toIFile))
    }

    export function prepareFromFileEntries(entries: ReadonlyArray<IWebkitFileSystemFileEntry>) {

        function toIFile(file: IWebkitFileSystemFileEntry): IFile {

            const asyncFile = FileSystemFileEntries.toAsync(file);

            return {
                path: file.fullPath,
                data: async () => asyncFile.file()
            }
        }

        return prepare(entries.map(toIFile))

    }

    export function prepare(files: ReadonlyArray<IFile>) {

        function toBaseFileRef(file: IFile): BaseFileRef {
            const name = Paths.basename(file.path);
            return {
                ref: {
                    name
                },
                data: file.data
            };
        }


        function computeImageFileRefs(): ReadonlyArray<ImageFileRef> {

            function filter(file: IFile) {
                return file.path.startsWith(".polar/files/image/") && file.path.endsWith(".png")
            }

            return files.filter(filter)
                         .map(toBaseFileRef)

        }

        function computeStashFileRefs(): ReadonlyArray<StashFileRef> {

            function filter(file: IFile) {
                return file.path.startsWith(".polar/stash/") && file.path.toLowerCase().endsWith(".pdf")
            }

            return files.filter(filter)
                        .map(toBaseFileRef)

        }

        function computeDocMetaProviders(): ReadonlyArray<DocMetaProvider> {

            function filter(file: IFile) {
                return file.path.startsWith(".polar/") && file.path.toLowerCase().endsWith("/state.json")
            }

            function toDocMetaProvider(file: IFile) {

                return async (): Promise<IDocMeta> => {

                    function computeFingerprint() {
                        const parts = file.path.split('/')
                        return parts[parts.length - 1];
                    }

                    const fingerprint = computeFingerprint();
                    const blob = await file.data();
                    const json = await Blobs.toText(blob);

                    return DocMetas.deserialize(json, fingerprint);
                }


            }

            return files.filter(filter)
                        .map(toDocMetaProvider)

        }

        const imageFileRefs = computeImageFileRefs();
        const stashFileRefs = computeStashFileRefs();
        const docMetaProviders = computeDocMetaProviders();

        return {imageFileRefs, stashFileRefs, docMetaProviders};

    }

}
