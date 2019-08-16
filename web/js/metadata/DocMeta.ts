import {DocInfo} from './DocInfo';
import {PageMeta} from './PageMeta';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {AnnotationInfos} from './AnnotationInfos';
import {Attachment} from './Attachment';
import {IPageMeta} from "./IPageMeta";
import {IAnnotationInfo} from "./AnnotationInfo";
import {IDocInfo} from "./IDocInfo";


/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
export class DocMeta extends SerializedObject implements IDocMeta {

    public docInfo: DocInfo;
    public pageMetas: {[id: string]: IPageMeta};
    public annotationInfo = AnnotationInfos.create();
    public version = 2;

    public attachments: {[id: string]: Attachment} = {};

    // constructor(template?: DocMeta) {
    //
    //     super(template);
    //
    //     if(template) {
    //         this.docInfo = Preconditions.assertNotNull(template.docInfo, "docInfo");
    //     } else {
    //         this.docInfo = null;
    //     }
    //
    //     this.init(template);
    //
    // }

    constructor(docInfo: DocInfo, pageMetas: {[id: number]: IPageMeta}) {
        super();
        this.docInfo = docInfo;
        this.pageMetas = pageMetas;
    }

    public getPageMeta(num: number) {

        num = Preconditions.assertPresent(num, "num");

        const pageMeta = this.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    public validate() {
        Preconditions.assertInstanceOf(this.docInfo, DocInfo, "docInfo");
        Preconditions.assertPresent(this.pageMetas, "pageMetas");
        Preconditions.assertNumber(this.version, "version");
    }

}



export interface IDocMeta {

    /**
     * The DocInfo which includes information like title, nrPages, etc.
     */
    docInfo: IDocInfo;


    /**
     * A sparse dictionary of page number to page metadata.
     *
     */
    pageMetas: { [id: number]: IPageMeta };

    /**
     * The annotation info for this document including the last annotation
     * time, progress, etc.
     */
    annotationInfo: IAnnotationInfo;

    /**
     * The version of this DocMeta version.
     */
    version: number;

}
