import {PersistenceLayerListener} from './PersistenceLayerListener';
import {IPersistenceLayer} from './IPersistenceLayer';

/**
 * Persistence layer that allows us to listen to changes in the backing store
 * including deletes, updates, and creates of DocMeta and provides details about
 * which files have been updated and their DocInfo.
 */
export interface ListenablePersistenceLayer extends IPersistenceLayer {
    addEventListener(listener: PersistenceLayerListener): void;
}
