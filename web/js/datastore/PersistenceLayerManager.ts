import {PersistenceLayer} from "./PersistenceLayer";
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {SynchronizationEvent} from './Datastore';

export class PersistenceLayerManager {

    private readonly persistenceLayerManagerEventDispatcher: IEventDispatcher<PersistenceLayerManagerEvent> = new SimpleReactor();

    public start(): void {

        // determine the persistence layer to use

    }

    public change(type: PersistenceLayerType) {

    }

    public addEventListener(listener: PersistenceLayerManagerEventListener) {
        return this.persistenceLayerManagerEventDispatcher.addEventListener(listener);
    }

}

export type PersistenceLayerType = 'local' | 'cloud';

/**
 * The state of the persistence layer.
 *
 * The proceeding go in the following order and can not go back:
 *
 * - creating        - about to be created
 * - created         - as been created
 * - initializing    - about to have init() called
 * - initialized     - init has been called.
 * - stopping        - about to call stop()
 * - stopped         - stopped
 *
 */
export type PersistenceLayerState = 'creating' | 'created' | 'initializing' |
                                    'initialized' | 'stopping' | 'stopped';

export interface PersistenceLayerManagerEvent {

    readonly type: PersistenceLayerType;
    readonly state: PersistenceLayerState;
    readonly persistenceLayer: PersistenceLayer;

}

export type PersistenceLayerManagerEventListener = (event: PersistenceLayerManagerEvent) => void;
