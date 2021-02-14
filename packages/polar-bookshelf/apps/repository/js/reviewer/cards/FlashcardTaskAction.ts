import * as React from 'react';
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

/**
 * A flashcard action to show in the UI with front and back slides.
 */
export interface FlashcardTaskAction {

    readonly front: React.ReactElement<any>;

    readonly back: React.ReactElement<any>;

    readonly docAnnotation: IDocAnnotation;

}
