import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

/**
 * An action to just *read* some text for review.  This is just a string.
 */
export interface ReadingTaskAction {
    readonly docAnnotation: IDocAnnotation;
}

