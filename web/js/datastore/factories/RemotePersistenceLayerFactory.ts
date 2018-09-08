import {remote} from 'electron';
import {Logger} from '../../logger/Logger';
import {IListenablePersistenceLayer} from '../IListenablePersistenceLayer';

const log = Logger.create();

export class RemotePersistenceLayerFactory {

    public static create(): IListenablePersistenceLayer {

        log.info("Using electron persistence layer and disk store");

        log.info("Accessing persistenceLayer...");
        const persistenceLayer = remote.getGlobal("persistenceLayer" );
        log.info("Accessing persistenceLayer...done");

        return persistenceLayer;

    }

}
