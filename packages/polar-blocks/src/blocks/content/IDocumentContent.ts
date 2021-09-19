import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IBaseContent} from "./IBaseContent";
import {IHasLinksContent} from "./IHasLinksContent";


/**
 * Basically the new IDocMeta
 * which contains details about a specific document including its annotations
 */
export interface IDocumentContent extends IBaseContent, IHasLinksContent {
    type: "document";
    docInfo: IDocInfo;
}
