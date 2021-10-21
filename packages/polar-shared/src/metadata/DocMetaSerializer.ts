import {IDocMeta} from "./IDocMeta";
import {Dictionaries} from "../util/Dictionaries";
import {DocMeta} from "./DocMeta";
import {DocInfos} from "./DocInfos";
import {IPageMeta} from "./IPageMeta";
import {PageInfo} from "./PageInfo";
import {PageMeta} from "./PageMeta";
import {SparseDocMetas} from "./SparseDocMetas";

export namespace DocMetaSerializer {

    export const ENABLE_SPARSE_DOC_SERIALIZE = true;

    export function copyOf(docMeta: IDocMeta): IDocMeta {
        docMeta = Dictionaries.copyOf(docMeta);
        const docInfo = Dictionaries.copyOf(docMeta.docInfo);
        return Object.assign(new DocMeta(docInfo, {}), docMeta);
    }

    /**
     * Create the basic DocInfo structure that we can use with required / basic
     * field structure.
     *
     * @param fingerprint The fingerprint of the document
     * @param nrPages The number of pages in this document.
     */
    export function create(fingerprint: string, nrPages: number, filename?: string) {

        const docInfo = DocInfos.create(fingerprint, nrPages, filename);

        const pageMetas: {[id: string]: IPageMeta} = {};

        for (let idx = 1; idx <= nrPages; ++idx) {
            const pageInfo = new PageInfo({num: idx});
            const pageMeta = new PageMeta({pageInfo});
            pageMetas[idx] = pageMeta;
        }

        return new DocMeta(docInfo, pageMetas);

    }

    export function serialize(docMeta: IDocMeta, spacing: string = "  ") {

        if (ENABLE_SPARSE_DOC_SERIALIZE) {
            const data = SparseDocMetas.toSparse(docMeta);
            return JSON.stringify(data, null, spacing);
        } else {
            return JSON.stringify(docMeta, null, spacing);
        }

    }

}
