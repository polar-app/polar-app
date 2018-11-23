import {remote} from 'electron';
import {DelegatedDatastore} from './DelegatedDatastore';
import {Datastore} from './Datastore';
import {RemoteDatastore} from './RemoteDatastore';

export class RemoteDatastores {

    public static create() {

        const datastore: Datastore = remote.getGlobal("datastore" );
        return new RemoteDatastore(datastore);

    }
}
