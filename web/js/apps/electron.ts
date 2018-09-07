
import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';
import {ElectronPersistenceLayerFactory} from '../datastore/ElectronPersistenceLayerFactory';
import {ElectronRendererPersistenceLayerFactory} from '../datastore/ElectronRendererPersistenceLayerFactory';
import {IPersistenceLayer} from '../datastore/IPersistenceLayer';

const log = Logger.create();

async function persistenceLayerFactory(): Promise<IPersistenceLayer> {
    //let electronPersistenceLayer = ElectronPersistenceLayerFactory.create();
    let electronPersistenceLayer = await ElectronRendererPersistenceLayerFactory.create();
        //return new PersistenceLayerDispatcher(PersistenceLayerWorkers.create(), electronPersistenceLayer);
    return electronPersistenceLayer;
}

new Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
