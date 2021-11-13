import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {IParsedDocMeta} from "polar-shared/src/util/IParsedDocMeta";
import {EPUBMetadataUsingNode} from "./EPUBMetadataUsingNode";
import {EPUBMetadataUsingBrowser} from "./EPUBMetadataUsingBrowser";

export namespace EPUBMetadata {

    function isNode() {
        return typeof window === 'undefined';
    }

    export async function getMetadata(docPathOrURL: PathOrURLStr): Promise<IParsedDocMeta> {

        if (isNode()) {
            return EPUBMetadataUsingNode.getMetadata(docPathOrURL);
        } else {
            return EPUBMetadataUsingBrowser.getMetadata(docPathOrURL);

        }

    }

}
