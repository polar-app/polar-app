import {PersistenceLayer} from './PersistenceLayer';
import {Logger} from '../logger/Logger';
import {Datastore} from './Datastore';
import {MemoryDatastore} from './MemoryDatastore';
import {DiskDatastore} from './DiskDatastore';

const log = Logger.create();

/**
 * Persistence layer without going through the main process for added throughput
 * and lower IPC but requires node integration.
 */
export class ElectronRendererPersistenceLayerFactory {

    public static async create(): Promise<PersistenceLayer> {

        log.info("Using persistence layer from renderer process.");

        let datastore = new DiskDatastore();
        await datastore.init();

        return new PersistenceLayer(datastore);

    }

}
