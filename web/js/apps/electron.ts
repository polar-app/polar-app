import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';
import {ElectronRendererPersistenceLayerFactory} from '../datastore/ElectronRendererPersistenceLayerFactory';
import {IListenablePersistenceLayer} from '../datastore/IListenablePersistenceLayer';

const log = Logger.create();

async function persistenceLayerFactory(): Promise<IListenablePersistenceLayer> {

    // let electronPersistenceLayer = ElectronPersistenceLayerFactory.create();
    // return new PersistenceLayerDispatcher(PersistenceLayerWorkers.create(), electronPersistenceLayer);

    return await ElectronRendererPersistenceLayerFactory.create();

}

new Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
