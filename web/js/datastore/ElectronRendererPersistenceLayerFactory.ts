import {DefaultPersistenceLayer} from './DefaultPersistenceLayer';
import {Logger} from '../logger/Logger';
import {Datastores} from './Datastores';

const log = Logger.create();

/**
 * Persistence layer without going through the main process for added throughput
 * and lower IPC but requires node integration.
 */
export class ElectronRendererPersistenceLayerFactory {

    public static async create(): Promise<DefaultPersistenceLayer> {

        log.info("Using persistence layer from renderer process.");

        let datastore = Datastores.create();
        await datastore.init();

        return new DefaultPersistenceLayer(datastore);

    }

}
