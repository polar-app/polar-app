import {DocMeta} from './DocMeta';

/**
 * A set of documents as a bundle.
 */
export class DocMetaSet {

    public readonly docMetas: DocMeta[];

    public constructor(...docMetas: DocMeta[]) {
        this.docMetas = docMetas;
    }

}
