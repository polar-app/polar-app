import * as React from 'react';
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {useReviewerCallbacks, useReviewerStore} from "../ReviewerStore";

const globalKeyMap = keyMapWithGroup({
    group: "Ratings",
    groupPriority: -1,
    keyMap: {

        AGAIN: {
            name: "Again",
            description: "Rate the item 'again'",
            sequences: [
                {
                    keys: '1',
                    platforms: ['macos', 'windows', 'linux']
                }
            ]
        },
        GOOD: {
            name: "Good",
            description: "Rate the item 'good'",
            sequences: [
                {
                    keys: '2',
                    platforms: ['macos', 'windows', 'linux']
                }
            ]
        },
        EASY: {
            name: "Easy",
            description: "Rate the item 'easy'",
            sequences: [
                {
                    keys: '3',
                    platforms: ['macos', 'windows', 'linux']
                }
            ]
        },

    }
});

export const LearningRatingGlobalHotKeys = React.memo(function LearningRatingGlobalHotKeys() {

    const {taskRep} = useReviewerStore(['taskRep']);

    const {onRating} = useReviewerCallbacks();

    const handleRating = React.useCallback((rating: Rating) => {

        if (! taskRep) {
            return;
        }

        onRating(taskRep, rating);
    }, [onRating, taskRep]);

    const globalKeyHandlers = {
        AGAIN: () => handleRating('again'),
        GOOD: () => handleRating('good'),
        EASY: () => handleRating('easy'),
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


