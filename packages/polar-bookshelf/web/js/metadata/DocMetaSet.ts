import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

/**
 * A set of documents as a bundle.
 */
export class DocMetaSet {

    public readonly docMetas: readonly IDocMeta[];

    public constructor(...docMetas: readonly IDocMeta[]) {
        this.docMetas = docMetas;
    }

}
