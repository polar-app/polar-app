"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewerCard = void 0;
var ReadingCard_1 = require("./ReadingCard");
var FlashcardCard_1 = require("./FlashcardCard");
var React = require("react");
var DoReadingCard = function (props) {
    var taskRep = props.taskRep;
    var readingTaskRep = taskRep;
    return <ReadingCard_1.ReadingCard taskRep={readingTaskRep} onRating={props.onRating}/>;
};
var DoFlashcardCard = function (props) {
    var taskRep = props.taskRep;
    var flashcardTaskRep = taskRep;
    var flashcardTaskAction = flashcardTaskRep.action;
    var front = flashcardTaskAction.front;
    var back = flashcardTaskAction.back;
    return <FlashcardCard_1.FlashcardCard taskRep={flashcardTaskRep} front={front} back={back} onRating={props.onRating}/>;
};
exports.ReviewerCard = function (props) {
    if (props.taskRep.mode === 'reading') {
        return <DoReadingCard {...props}/>;
    }
    else {
        return <DoFlashcardCard {...props}/>;
    }
};
