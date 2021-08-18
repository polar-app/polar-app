import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IBaseContent} from "./IBaseContent";


/**
 * Basically the new IDocMeta
 * which contains details about a specific document including its annotations
 */
export interface IDocumentContent extends IBaseContent, Omit<IDocMeta, "pageMetas"> {
    type: "document";
}
