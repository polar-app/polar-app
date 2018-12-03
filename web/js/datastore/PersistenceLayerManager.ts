import {PersistenceLayer} from "./PersistenceLayer";
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {SynchronizationEvent} from './Datastore';
import {RemotePersistenceLayerFactory} from './factories/RemotePersistenceLayerFactory';

export class PersistenceLayerManager {

    private readonly persistenceLayerManagerEventDispatcher: IEventDispatcher<PersistenceLayerManagerEvent> = new SimpleReactor();

    private persistenceLayer?: PersistenceLayer;

    public start(): void {

        // determine the persistence layer to use

        // FIXME: now the biggest problem is that the session in electron isn't
        // shared between the main window and hte viewers so the localStorage
        // isn't the same instance so we're missing variables.. This means I
        // can't easily communicate that the

        // FIXME: use a Broadcaster for this I think...
        // We will have to use a PersistenceLayerManagerService in the main proc
        // and then use ipcRenderer here...

        // FIXME: another problem I have now is that the main proc has a
        // different session and I don't think the viewer will be able to login
        // to firebase but maybe it doesn't matter... Actually it DOES NOT
        // matter if I rework it to make the the viewers use a new type of
        // PersistenceLayer that ALWAYs goes through the document repository to
        // perform writes.  The problem though is that a doc repisotiry instance
        // would need to be running at all times - which is kind of a problem.
        //
        // The two ways I could bypass this:
        //
        // - share the session which I don't think I can do due to the protocol
        //   handler we're using
        //
        // - pass the cookies to the htmlviewers and have them login
        //   automatically
        //
        // - have some sort of cookie forwarder that listens to cookies and
        //   and defines them everywhere
        //
        // - use one 'remote' writer for passing all writes to the main doc
        //   repo window.

    }

    public async change(type: PersistenceLayerType) {

        if (this.persistenceLayer) {

            this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'stopping'});

            await this.persistenceLayer.stop();

            this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'stopped'});

        }

        this.persistenceLayer = await this.createPersistenceLayer('local');
        this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'changed'});

        await this.persistenceLayer.init();

        this.dispatchEvent({type, persistenceLayer: this.persistenceLayer, state: 'changed'});

    }

    private async createPersistenceLayer(type: PersistenceLayerType) {

        return RemotePersistenceLayerFactory.create();

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
