/**
 *
 */
import {PersistenceLayerManager, PersistenceLayerState} from './PersistenceLayerManager';
import {PersistenceLayer} from './PersistenceLayer';
import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';

export class PersistenceLayerManagers {


    /**
     * Call the given callback for the PersistenceLayer currently in place.
     *
     * This allows us to both get a callback on the CURRENT PersistenceLayer
     * but also when a new PersistenceLayer is changed.
     *
     * @param state Call the callback again when we've changed to the given
     *     state
     */
    public static onPersistenceManager(persistenceLayerManager: PersistenceLayerManager,
                                       callback: PersistenceLayerCallback,
                                       state: PersistenceLayerState = 'changed' ) {

        if (persistenceLayerManager.get()) {
            callback(persistenceLayerManager.get());
        }

        persistenceLayerManager.addEventListener(event => {

            if (event.state === state) {
                callback(event.persistenceLayer);
            }

        });

    }

}

export type PersistenceLayerCallback = (persistenceLayer: ListenablePersistenceLayer) => void;
