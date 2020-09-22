import React from 'react';
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useLogger} from "../../../mui/MUILogger";
import {AsyncProvider} from "polar-shared/src/util/Providers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Backend} from "polar-shared/src/datastore/Backend";

type DocMetaProvider = AsyncProvider<IDocMeta>;

type DocMetaRefsProvider = () => Promise<ReadonlyArray<DocMetaProvider>>

export function useDiskDatastoreMigration() {

    const log = useLogger();
    const {persistenceLayerProvider} = usePersistenceLayerContext()

    return React.useCallback((migrationProvider: DocMetaRefsProvider) => {

        const persistenceLayer = persistenceLayerProvider();

        async function doDocMetaMigration(docMetaProvider: DocMetaProvider) {
            const docMeta = await docMetaProvider()
            await persistenceLayer.writeDocMeta(docMeta);
        }

        // async function doStashMigration(docMetaProvider: DocMetaProvider) {
        //     await persistenceLayer.writeFile(Backend.STASH, );
        // }

        async function doAsync() {

            const docMetaProviders = await migrationProvider();

            for (const docMetaProvider of docMetaProviders) {

                const docMeta = await docMetaProvider;

            }

        }

        doAsync()
            .catch(err => log.error(err));

    }, [persistenceLayerProvider, log])

}

export namespace DiskDatastoreMigration {



}
