import {DocMeta} from './DocMeta';

/**
 * A (potentially) lightweight supplier of DocMeta objects.
 */
export type DocMetaSupplier = () => Promise<DocMeta>;
