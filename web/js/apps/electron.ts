import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';

import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {DefaultPersistenceLayerFactory} from '../datastore/factories/DefaultPersistenceLayerFactory';
import {RemotePersistenceLayerFactory} from '../datastore/factories/RemotePersistenceLayerFactory';

const log = Logger.create();

async function persistenceLayerFactory(): Promise<ListenablePersistenceLayer> {

    // let electronPersistenceLayer = ElectronPersistenceLayerFactory.create();
    // return new PersistenceLayerDispatcher(PersistenceLayerWorkers.create(), electronPersistenceLayer);

    const persistenceLayer = RemotePersistenceLayerFactory.create();
    await persistenceLayer.init();
    return persistenceLayer;

}

new Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
