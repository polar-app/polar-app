import {AnnotationType} from '../metadata/AnnotationType';
import {Screenshot} from '../metadata/Screenshot';
import {Point} from '../Point';
import {HighlightColor} from '../metadata/BaseHighlight';
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';

export interface DocAnnotation {
    id: string;
    annotationType: AnnotationType;
    html?: string;
    screenshot?: Screenshot;
    pageNum: number;
    position: Point;
    created: ISODateTimeString;

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    color?: HighlightColor;

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


