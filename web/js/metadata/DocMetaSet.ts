import {DocMeta, IDocMeta} from './DocMeta';

/**
 * A set of documents as a bundle.
 */
export class DocMetaSet {

    public readonly docMetas: IDocMeta[];

    public constructor(...docMetas: IDocMeta[]) {
        this.docMetas = docMetas;
    }

}
