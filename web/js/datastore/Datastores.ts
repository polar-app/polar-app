import {Datastore} from './Datastore';
import {MemoryDatastore} from './MemoryDatastore';
import {DiskDatastore} from './DiskDatastore';
import {Logger} from '../logger/Logger';

const log = Logger.create();

const ENV_POLAR_DATASTORE = 'POLAR_DATASTORE';

export class Datastores {

    public static create(): Datastore {

        const name = process.env[ENV_POLAR_DATASTORE];

        if (name === 'MEMORY') {
            log.info("Using memory datastore");
            return new MemoryDatastore();
        }

        return new DiskDatastore();

    }

}
