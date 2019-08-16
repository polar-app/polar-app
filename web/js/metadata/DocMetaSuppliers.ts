import {DocMetaSupplier} from './DocMetaSupplier';
import {DocMeta} from './DocMeta';

export class DocMetaSuppliers {

    public static literal(docMeta: IDocMeta): DocMetaSupplier {
        return async () => docMeta;
    }

}
