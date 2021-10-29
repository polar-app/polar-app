import * as React from 'react';

/**
 * A flashcard action to show in the UI with front and back slides.
 */
export interface FlashcardTaskAction<T> {
    readonly type: 'flashcard';

    readonly front: React.ReactElement;

    readonly back: React.ReactElement;

    readonly original: T;

}
