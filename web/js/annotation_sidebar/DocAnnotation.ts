import {AnnotationType} from '../metadata/AnnotationType';
import {Comment} from '../metadata/Comment';
import {Screenshot} from '../metadata/Screenshot';
import {Point} from '../Point';
import {HighlightColor} from '../metadata/BaseHighlight';
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';
import {PageMeta} from '../metadata/PageMeta';
import {HTMLString} from '../util/HTMLString';

export interface DocAnnotation {

    id: string;
    annotationType: AnnotationType;
    html?: HTMLString;
    fields?: {[name: string]: HTMLString};
    screenshot?: Screenshot;
    pageNum: number;
    position: Point;
    created: ISODateTimeString;

    comments: Comment[];
    children: DocAnnotation[];

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    color?: HighlightColor;

    pageMeta: PageMeta;

}

/**
 * A map from ID to the actual DocAnnotation.
 */
// noinspection TsLint: interface-over-type-literal
export type DocAnnotationMap = {[id: string]: DocAnnotation};

/**
 * Annotations according to their position in the document.
 */
export type SortedDocAnnotations = DocAnnotation[];


