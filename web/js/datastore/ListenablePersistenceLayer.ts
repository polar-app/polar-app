import {PersistenceLayerListener} from './PersistenceLayerListener';
import {PersistenceLayer} from './PersistenceLayer';

/**
 * Persistence layer that allows us to listen to changes in the backing store
 * including deletes, updates, and creates of DocMeta and provides details about
 * which files have been updated and their DocInfo.
 */
export interface ListenablePersistenceLayer extends PersistenceLayer {

    addEventListener(listener: PersistenceLayerListener): void;

    /**
     * Add an event listener but for a specific document in the repository.
     *
     * @param fingerprint
     * @param listener
     */
    addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void;

}
