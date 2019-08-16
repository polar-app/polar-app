import {DocMeta} from './DocMeta';
import {IDocMeta} from "./IDocMeta";

/**
 * A (potentially) lightweight supplier of DocMeta objects.
 */
export type DocMetaSupplier = () => Promise<IDocMeta>;
