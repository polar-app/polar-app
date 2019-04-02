import {Launcher} from './Launcher';
import {FirebasePersistenceLayerFactory} from "../datastore/factories/FirebasePersistenceLayerFactory";
import {Logger} from '../logger/Logger';

const log = Logger.create();

new Launcher().launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));


