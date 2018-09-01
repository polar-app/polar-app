import {Datastore} from './Datastore';
import {MemoryDatastore} from './MemoryDatastore';
import {DiskDatastore} from './DiskDatastore';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class Datastores {

    public static create(): Datastore {

        let name = process.env['POLAR_DATASTORE'];

        if(name == 'MEMORY') {
            log.info("Using memory datastore");
            return new MemoryDatastore();
        }

        return new DiskDatastore();

    }

}
