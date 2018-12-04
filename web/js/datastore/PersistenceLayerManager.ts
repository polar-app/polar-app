import {PersistenceLayer} from "./PersistenceLayer";
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {SynchronizationEvent} from './Datastore';
import {RemotePersistenceLayerFactory} from './factories/RemotePersistenceLayerFactory';
import {CloudAwareDatastore} from './CloudAwareDatastore';
import {CloudPersistenceLayerFactory} from "./factories/CloudPersistenceLayerFactory";

export class PersistenceLayerManager {

    private readonly persistenceLayerManagerEventDispatcher: IEventDispatcher<PersistenceLayerManagerEvent> = new SimpleReactor();

    private persistenceLayer?: PersistenceLayer;

    public start(): void {

        const type = PersistenceLayerTypes.get();

        this.change(type);

    }

    public async change(type: PersistenceLayerType) {

        if (this.persistenceLayer) {

            this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'stopping'});

            await this.persistenceLayer.stop();

            this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'stopped'});

        }

        this.persistenceLayer = await this.createPersistenceLayer(type);

        this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'changed'});

        await this.persistenceLayer.init();

        this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'initialized'});

    }

    private async createPersistenceLayer(type: PersistenceLayerType) {

        if (type === 'local') {
            return RemotePersistenceLayerFactory.create();
        }

        if (type === 'cloud') {
            return CloudPersistenceLayerFactory.create();
        }

        throw new Error("Unknown type: " + type);


    }

    public addEventListener(listener: PersistenceLayerManagerEventListener) {
        return this.persistenceLayerManagerEventDispatcher.addEventListener(listener);
    }

    private dispatchEvent(event: PersistenceLayerManagerEvent): void {
        this.persistenceLayerManagerEventDispatcher.dispatchEvent(event);
    }

}

export type PersistenceLayerType = 'local' | 'cloud';

/**
 * The state of the persistence layer.
 *
 * The proceeding go in the following order and can not go back:
 *
 * - changed         - change to a new persistence layer which has been created
 *                     but not yet initialized.
 * - initialized     - init has been called.
 * - stopping        - about to call stop()
 * - stopped         - stopped
 *
 */
export type PersistenceLayerState = 'changed' | 'initialized' | 'stopping' | 'stopped';

export interface PersistenceLayerManagerEvent {

    readonly type: PersistenceLayerType;
    readonly state: PersistenceLayerState;
    readonly persistenceLayer: PersistenceLayer;

}

export type PersistenceLayerManagerEventListener = (event: PersistenceLayerManagerEvent) => void;

export class PersistenceLayerTypes {

    private static readonly KEY = 'polar-persistence-layer';

    public static get(): PersistenceLayerType {

        const currentType = window.localStorage.getItem(this.KEY);

        if (! currentType) {
            return 'local';
        }

        if (currentType === 'local' || currentType === 'cloud') {
            return currentType;
        }

        throw new Error("Unknown type: " + currentType);

    }

    public static set(type: PersistenceLayerType) {
        window.localStorage.setItem(this.KEY, type);
    }

}
