import {DocMetaSupplier} from './DocMetaSupplier';
import {DocMeta} from './DocMeta';
import {IDocMeta} from "./IDocMeta";

export class DocMetaSuppliers {

    public static literal(docMeta: IDocMeta): DocMetaSupplier {
        return async () => docMeta;
    }

}
