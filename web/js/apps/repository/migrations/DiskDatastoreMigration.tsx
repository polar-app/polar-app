import React from 'react';
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {RemoteDatastores} from "../../../datastore/RemoteDatastores";
import {DefaultPersistenceLayer} from "../../../datastore/DefaultPersistenceLayer";
import {
    usePersistenceContext,
    usePersistenceLayerContext
} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {PersistenceLayers} from "../../../datastore/PersistenceLayers";
import {useLogger} from "../../../mui/MUILogger";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import Button from '@material-ui/core/Button';

function useDiskDatastoreMigrationPrompt() {

    const dialogs = useDialogManager();
    const diskDatastoreMigration = useDiskDatastoreMigration();
    return React.useCallback(() => {

        dialogs.confirm({
            title: "Start local data migration?",
            subtitle: (
                <div>

                    <p>
                        We are about to migrate all your data into the cloud.
                    </p>

                    <p>
                        This process will copy all your annotations, notes, and
                        documents.
                    </p>

                    <p>
                        All your data will be preserved locally and <b>WILL NOT</b>
                        be deleted after the transfer is completed.
                    </p>

                </div>
            ),
            onAccept: diskDatastoreMigration
        })

    },  [dialogs, diskDatastoreMigration]);

}

function useDiskDatastoreMigration() {

    const dialogs = useDialogManager();
    const log = useLogger();
    const {persistenceLayerProvider} = usePersistenceLayerContext();

    return React.useCallback(() => {

        const remotePersistenceLayer = createRemotePersistenceLayer();
        const persistenceLayer = persistenceLayerProvider();

        async function doAsync() {

            const taskProgressCallback = await dialogs.taskbar({
                message: "Transferring local data to cloud... "
            });

            const source = await PersistenceLayers.toSyncOrigin(remotePersistenceLayer.datastore);
            const target = await PersistenceLayers.toSyncOrigin(persistenceLayer.datastore);

            await PersistenceLayers.transfer(source, target, async (snapshot) => {
                taskProgressCallback({value: snapshot.progress.progress});
            });

        }

        doAsync().catch(err => log.error(err));


    },  [dialogs, log, persistenceLayerProvider]);

}

function createRemoteDatastore() {
    return RemoteDatastores.create();
}

function createRemotePersistenceLayer() {
    const remoteDatastore = createRemoteDatastore();
    return new DefaultPersistenceLayer(remoteDatastore);
}

export const DiskDatastoreMigrationButton = React.memo(() => {

    const onClick = useDiskDatastoreMigrationPrompt();

    if (! AppRuntime.isElectron()) {
        return null;
    }

    return (
        <Button onClick={onClick}>
            Start Polar 1.0 Migration Wizard
        </Button>
    );

});
