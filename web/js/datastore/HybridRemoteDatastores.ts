import {Datastore} from './Datastore';
import {HybridRemoteDatastore} from './HybridRemoteDatastore';
import {RemoteDatastores} from './RemoteDatastores';

export class HybridRemoteDatastores {

    public static create() {
        const datastore: Datastore = RemoteDatastores.create();
        return new HybridRemoteDatastore(datastore);
    }

}
