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
exports.FlashcardGlobalHotKeys = void 0;
const React = __importStar(require("react"));
const GlobalKeyboardShortcuts_1 = require("../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts");
const FlashcardStore_1 = require("./FlashcardStore");
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Flashcards",
    groupPriority: -1,
    keyMap: {
        SHOW_ANSWER: {
            name: "Show Answer",
            description: "Show the answer (flip) of the current flashcard",
            sequences: [' ', 'Enter']
        },
    }
});
exports.FlashcardGlobalHotKeys = React.memo(() => {
    const { setSide } = FlashcardStore_1.useFlashcardCallbacks();
    const handleShowAnswer = React.useCallback(() => {
        setSide('back');
    }, [setSide]);
    const globalKeyHandlers = {
        SHOW_ANSWER: handleShowAnswer,
    };
    return (React.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers }));
});
//# sourceMappingURL=FlashcardGlobalHotKeys.js.map