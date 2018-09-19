import {AnnotationType} from '../metadata/AnnotationType';
import {Screenshot} from '../metadata/Screenshot';
import {Point} from '../Point';

export interface DocAnnotation {
    id: string;
    annotationType: AnnotationType;
    html?: string;
    screenshot?: Screenshot;
    pageNum: number;
    position: Point;
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


