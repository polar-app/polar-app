"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRatingGlobalHotKeys = void 0;
const React = __importStar(require("react"));
const GlobalKeyboardShortcuts_1 = require("../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts");
const ReviewerStore_1 = require("../ReviewerStore");
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Ratings",
    groupPriority: -1,
    keyMap: {
        AGAIN: {
            name: "Again",
            description: "Rate the item 'again'",
            sequences: ['1']
        },
        HARD: {
            name: "Hard",
            description: "Rate the item 'hard'",
            sequences: ['2']
        },
        GOOD: {
            name: "Good",
            description: "Rate the item 'good'",
            sequences: ['3']
        },
        EASY: {
            name: "Easy",
            description: "Rate the item 'easy'",
            sequences: ['4']
        },
    }
});
exports.ReviewRatingGlobalHotKeys = React.memo(() => {
    const { taskRep } = ReviewerStore_1.useReviewerStore(['taskRep']);
    const { onRating } = ReviewerStore_1.useReviewerCallbacks();
    const handleRating = React.useCallback((rating) => {
        if (!taskRep) {
            return;
        }
        onRating(taskRep, rating);
    }, [onRating, taskRep]);
    const globalKeyHandlers = {
        AGAIN: () => handleRating('again'),
        HARD: () => handleRating('hard'),
        GOOD: () => handleRating('good'),
        EASY: () => handleRating('easy'),
    };
    return (React.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers }));
});
//# sourceMappingURL=ReviewRatingGlobalHotKeys.js.map