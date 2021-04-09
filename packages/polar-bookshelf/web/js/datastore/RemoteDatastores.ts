import {RemoteDatastore} from './RemoteDatastore';
import {DiskDatastore} from './DiskDatastore';

export namespace RemoteDatastores {

    export function create() {
        const {remote} = window.require('electron');
        const datastore: DiskDatastore = remote.getGlobal("datastore" );
        return new RemoteDatastore(datastore);
    }

}
