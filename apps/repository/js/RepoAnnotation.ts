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

// FIXME: a lot of duplication here between DocAnnotations DocAnnotation

export interface RepoAnnotation {

    /**
     * The document fingerprint this annotation belongs to.
     */
    fingerprint: string;

    id: string;

    text?: string;

    type: AnnotationType;

    created: ISODateTimeString;

    tags?: Readonly<{[id: string]: Tag}>;

    /**
     * Extended metadata specific to each annotation type.
     */
    meta?: RepoHighlightInfo;

    /**
     * The original DocInfo used to construct this RepoDocInfo.
     */
    docInfo: IDocInfo;

    img?: Img;


}

/**
 * Additional metadata on a highlight.
 */
export interface RepoHighlightInfo {
    color?: HighlightColor;
}
