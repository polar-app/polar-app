import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';
import {ElectronRendererPersistenceLayerFactory} from '../datastore/ElectronRendererPersistenceLayerFactory';
import {IPersistenceLayer} from '../datastore/IPersistenceLayer';

const log = Logger.create();

async function persistenceLayerFactory(): Promise<IPersistenceLayer> {

    // let electronPersistenceLayer = ElectronPersistenceLayerFactory.create();
    // return new PersistenceLayerDispatcher(PersistenceLayerWorkers.create(), electronPersistenceLayer);

    return await ElectronRendererPersistenceLayerFactory.create();

}

new Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
