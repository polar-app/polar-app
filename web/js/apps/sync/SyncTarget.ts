/**
 * A SyncTarget provides a way to integrate with 3rd party sync implementations.
 */
import {DocMeta} from '../../metadata/DocMeta';

export interface SyncTarget {

    sync(docMeta: DocMeta): void;

}
