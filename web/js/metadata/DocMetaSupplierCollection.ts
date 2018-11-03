import {DocMeta} from './DocMeta';
import {DocMetaSupplier} from './DocMetaSupplier';

/**
 * A set of DocMetaSuppliers as a bundle
 */
export class DocMetaSupplierCollection {

    public readonly docMetaSuppliers: DocMetaSupplier[];

    public constructor(...docMetaSuppliers: DocMetaSupplier[]) {
        this.docMetaSuppliers = docMetaSuppliers;
    }

}
