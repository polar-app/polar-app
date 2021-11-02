import * as React from 'react';
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {useReviewerStore} from "../ReviewerStore";

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
        HARD: {
            name: "Hard",
            description: "Rate the item 'hard'",
            sequences: [
                {
                    keys: '2',
                    platforms: ['macos', 'windows', 'linux']
                }
            ]
        },
        GOOD: {
            name: "Good",
            description: "Rate the item 'good'",
            sequences: [
                {
                    keys: '3',
                    platforms: ['macos', 'windows', 'linux']
                }
            ]
        },
        EASY: {
            name: "Easy",
            description: "Rate the item 'easy'",
            sequences: [
                {
                    keys: '4',
                    platforms: ['macos', 'windows', 'linux']
                }
            ]
        },

    }
});

export const ReviewRatingGlobalHotKeys = React.memo(function ReviewRatingGlobalHotKeys() {

    const store = useReviewerStore();

    const handleRating = React.useCallback((rating: Rating) => {

        if (! store.currentTaskRep) {
            return;
        }

        store.onRating(store.currentTaskRep, rating);

    }, [store]);

    const globalKeyHandlers = {
        AGAIN: () => handleRating('again'),
        HARD: () => handleRating('hard'),
        GOOD: () => handleRating('good'),
        EASY: () => handleRating('easy'),
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


