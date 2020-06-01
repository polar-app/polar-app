import {Datastores} from './Datastores';
import {Datastore} from './Datastore';

declare var global: any;

export class MainDatastore {

    public static create(): Datastore {
        const datastore = Datastores.create();
        global.datastore = datastore;
        return datastore;
    }

}
