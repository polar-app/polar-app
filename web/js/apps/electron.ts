import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {Launcher} from './Launcher';
import {Logger} from '../logger/Logger';

const log = Logger.create();

function persistenceLayerFactory(): PersistenceLayer {

    console.log("Using electron persistence layer and disk store");

    const remote = require('electron').remote;

    console.log("Accessing datastore...");
    let datastore = remote.getGlobal("datastore" );
    console.log("Accessing datastore...done");

    return new PersistenceLayer(datastore);

}

new Launcher(persistenceLayerFactory).launch()
    .then(() => console.log("App now loaded."))
    .catch(err => log.error(err));
