import {IPersistenceLayer, PersistenceLayer} from '../datastore/PersistenceLayer';
import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';
import {ElectronPersistenceLayerFactory} from '../datastore/ElectronPersistenceLayerFactory';
import {PersistenceLayerDispatcher} from '../datastore/dispatcher/PersistenceLayerDispatcher';
import {PersistenceLayerWorkers} from '../datastore/dispatcher/PersistenceLayerWorkers';

const log = Logger.create();

function persistenceLayerFactory(): IPersistenceLayer {
    let electronPersistenceLayer = ElectronPersistenceLayerFactory.create();
    return new PersistenceLayerDispatcher(PersistenceLayerWorkers.create(), electronPersistenceLayer);
}

new Launcher(persistenceLayerFactory).launch()
    .then(() => console.log("App now loaded."))
    .catch(err => log.error(err));
