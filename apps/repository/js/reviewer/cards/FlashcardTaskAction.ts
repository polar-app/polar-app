import * as React from 'react';

/**
 * A flashcard action to show in the UI with front and back slides.
 */
export interface FlashcardTaskAction {

    readonly front: React.ReactElement<any>;

    readonly back: React.ReactElement<any>;

}
