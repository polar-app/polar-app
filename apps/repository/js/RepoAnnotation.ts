/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {ISODateTimeString} from '../../../web/js/metadata/ISODateTimeStrings';
import {Tag} from '../../../web/js/tags/Tag';
import {Hashcode} from '../../../web/js/metadata/Hashcode';
import {AnnotationType} from '../../../web/js/metadata/AnnotationType';
import {HighlightColor} from '../../../web/js/metadata/BaseHighlight';
import {Img} from '../../../web/js/metadata/Img';

// TODO: a lot of duplication here between DocAnnotations DocAnnotation

export interface RepoAnnotation {

    /**
     * The document fingerprint this annotation belongs to.
     */
    readonly fingerprint: string;

    readonly id: string;

    readonly text?: string;

    readonly type: AnnotationType;

    readonly created: ISODateTimeString;

    readonly tags?: Readonly<{[id: string]: Tag}>;

    /**
     * Extended metadata specific to each annotation type.
     */
    readonly meta?: RepoHighlightInfo;

    /**
     * The original DocInfo used to construct this RepoDocInfo.
     */
    // TODO this is a bug I think because the DocInfo is never updated so we
    // are going to have stale metadata.  It would be better to just have
    // a pointer to this directly.
    readonly docInfo: IDocInfo;

    readonly img?: Img;


}

/**
 * Additional metadata on a highlight.
 */
export interface RepoHighlightInfo {
    color?: HighlightColor;
}
