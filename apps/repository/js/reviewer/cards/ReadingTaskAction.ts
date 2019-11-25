/**
 * An action to just *read* some text for review.  This is just a string.
 */
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

export interface ReadingTaskAction {
    readonly text: string;
    readonly docAnnotation: IDocAnnotation;
}

