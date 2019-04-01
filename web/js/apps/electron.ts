import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';

import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {DefaultPersistenceLayerFactory} from '../datastore/factories/DefaultPersistenceLayerFactory';
import {RemotePersistenceLayerFactory} from '../datastore/factories/RemotePersistenceLayerFactory';

const log = Logger.create();

new Launcher().launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
