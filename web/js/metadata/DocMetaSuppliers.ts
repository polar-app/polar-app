import {DocMetaSupplier} from './DocMetaSupplier';
import {DocMeta} from './DocMeta';

export class DocMetaSuppliers {

    public static literal(docMeta: DocMeta): DocMetaSupplier {
        return new DefaultDocMetaSupplier(docMeta);
    }

}

export class DefaultDocMetaSupplier implements DocMetaSupplier {

    private readonly backing: DocMeta;

    constructor(backing: DocMeta) {
        this.backing = backing;
    }

    public async get(): Promise<DocMeta> {
        return this.backing;
    }

}
