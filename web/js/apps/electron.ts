import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';

import {IListenablePersistenceLayer} from '../datastore/IListenablePersistenceLayer';
import {DefaultPersistenceLayerFactory} from '../datastore/factories/DefaultPersistenceLayerFactory';

const log = Logger.create();

async function persistenceLayerFactory(): Promise<IListenablePersistenceLayer> {

    // let electronPersistenceLayer = ElectronPersistenceLayerFactory.create();
    // return new PersistenceLayerDispatcher(PersistenceLayerWorkers.create(), electronPersistenceLayer);

    return await DefaultPersistenceLayerFactory.create();

}

new Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
