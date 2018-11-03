import {DocMeta} from './DocMeta';

/**
 * A (potentially) lightweight supplier of DocMeta objects.
 */
export interface DocMetaSupplier {

    get(): Promise<DocMeta>;

}
