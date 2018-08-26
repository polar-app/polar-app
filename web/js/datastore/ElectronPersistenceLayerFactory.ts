import {PersistenceLayer} from './PersistenceLayer';

export class ElectronPersistenceLayerFactory {

    public static create(): PersistenceLayer {

        console.log("Using electron persistence layer and disk store");

        const remote = require('electron').remote;

        console.log("Accessing datastore...");
        let datastore = remote.getGlobal("datastore" );
        console.log("Accessing datastore...done");

        return new PersistenceLayer(datastore);

    }

}
