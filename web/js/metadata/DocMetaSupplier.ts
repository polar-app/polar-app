import {DocMeta, IDocMeta} from './DocMeta';

/**
 * A (potentially) lightweight supplier of DocMeta objects.
 */
export type DocMetaSupplier = () => Promise<IDocMeta>;
