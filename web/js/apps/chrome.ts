
import {Launcher} from './Launcher';
import {FirebasePersistenceLayerFactory} from "../datastore/factories/FirebasePersistenceLayerFactory";
import {Logger} from '../logger/Logger';

const log = Logger.create();

async function persistenceLayerFactory() {

    const persistenceLayer = FirebasePersistenceLayerFactory.create();
    await persistenceLayer.init();
    return persistenceLayer;

}

new Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
