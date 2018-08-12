import {DocInfo} from './DocInfo';
import {PageMeta} from './PageMeta';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {AnnotationInfos} from './AnnotationInfos';


/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
export class DocMeta extends SerializedObject {

    /**
     * The DocInfo which includes information like title, nrPages, etc.
     */
    public docInfo: DocInfo;


    /**
     * A sparse dictionary of page number to page metadata.
     *
     */
    public pageMetas: {[id: number]: PageMeta};

    /**
     * The annotation info for this document including the last annotation
     * time, progress, etc.
     */
    public annotationInfo = AnnotationInfos.create();

    /**
     * The version of this DocMeta version.
     */
    public version = 1;

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

    constructor(docInfo: DocInfo, pageMetas: {[id: number]: PageMeta}) {
        super();
        this.docInfo = docInfo;
        this.pageMetas = pageMetas;
    }

    getPageMeta(num: number) {

        num = Preconditions.assertNotNull(num, "num");

        let pageMeta = this.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    validate() {
        Preconditions.assertInstanceOf(this.docInfo, DocInfo, "docInfo");
        Preconditions.assertNotNull(this.pageMetas, "pageMetas");
        Preconditions.assertNumber(this.version, "version");
    }

}
