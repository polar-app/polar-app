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
exports.ReviewerCard = void 0;
const React = __importStar(require("react"));
const ReadingCard_1 = require("./ReadingCard");
const FlashcardCard_1 = require("./FlashcardCard");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const DoReadingCard = ReactUtils_1.deepMemo((props) => {
    const { taskRep } = props;
    const readingTaskRep = taskRep;
    return React.createElement(ReadingCard_1.ReadingCard, { taskRep: readingTaskRep });
});
const DoFlashcardCard = ReactUtils_1.deepMemo((props) => {
    const { taskRep } = props;
    const flashcardTaskRep = taskRep;
    const flashcardTaskAction = flashcardTaskRep.action;
    const front = flashcardTaskAction.front;
    const back = flashcardTaskAction.back;
    return React.createElement(FlashcardCard_1.FlashcardCard, { taskRep: flashcardTaskRep, front: front, back: back });
});
exports.ReviewerCard = (props) => {
    if (props.taskRep.mode === 'reading') {
        return React.createElement(DoReadingCard, Object.assign({}, props));
    }
    else {
        return React.createElement(DoFlashcardCard, Object.assign({}, props));
    }
};
//# sourceMappingURL=ReviewerCard.js.map