import {AnnotationType} from '../metadata/AnnotationType';
import {Comment} from '../metadata/Comment';
import {Point} from '../Point';
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';
import {PageMeta} from '../metadata/PageMeta';
import {HTMLString} from '../util/HTMLString';
import {Ref} from '../metadata/Refs';
import {Flashcard} from '../metadata/Flashcard';
import {AreaHighlight} from '../metadata/AreaHighlight';
import {TextHighlight} from '../metadata/TextHighlight';
import {ObjectID} from '../util/ObjectIDs';
import {Img} from '../metadata/Img';
import {HighlightColor} from '../metadata/HighlightColor';
import {DocMeta} from '../metadata/DocMeta';

export interface DocAnnotation extends ObjectID {

    readonly id: string;
    readonly annotationType: AnnotationType;
    readonly html?: HTMLString;
    readonly fields?: {[name: string]: HTMLString};
    readonly pageNum: number;
    readonly position: Point;
    readonly created: ISODateTimeString;

    // the reference to a parent annotation if this is a child annotation.
    readonly ref?: Ref;

    children: DocAnnotation[];

    readonly img?: Img;

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    readonly color?: HighlightColor;

    readonly docMeta: DocMeta;

    readonly pageMeta: PageMeta;

    readonly original: Comment | Flashcard | AreaHighlight | TextHighlight;

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
