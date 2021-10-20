import {IDocMeta} from "./IDocMeta";
import {SparseDocMetas} from "./SparseDocMetas";

export namespace DocMetaSerializer {

    export const ENABLE_SPARSE_DOC_SERIALIZE = true;

    export function serialize(docMeta: IDocMeta, spacing: string = "  ") {

        if (ENABLE_SPARSE_DOC_SERIALIZE) {
            const data = SparseDocMetas.toSparse(docMeta);
            return JSON.stringify(data, null, spacing);
        } else {
            return JSON.stringify(docMeta, null, spacing);
        }

    }


}
