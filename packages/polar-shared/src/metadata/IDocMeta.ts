import {IDocInfo} from "./IDocInfo";
import {IPageMeta} from "./IPageMeta";
import {IAnnotationInfo} from "./IAnnotationInfo";
import {IAttachment} from "./IAttachment";

export interface IDocMeta {

    /**
     * The DocInfo which includes information like title, nrPages, etc.
     */
    readonly docInfo: IDocInfo;

    /**
     * A sparse dictionary of page number to page metadata.
     */
    readonly pageMetas: { readonly [id: number]: IPageMeta };

    /**
     * The annotation info for this document including the last annotation
     * time, progress, etc.
     */
    readonly annotationInfo: IAnnotationInfo;

    /**
     * The version of this DocMeta version.
     */
    readonly version: number;

    readonly attachments: { readonly [id: string]: IAttachment };

}
