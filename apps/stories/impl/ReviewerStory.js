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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewerStory = void 0;
const React = __importStar(require("react"));
const Refs_1 = require("polar-shared/src/metadata/Refs");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const TasksCalculator_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator");
const react_router_dom_1 = require("react-router-dom");
const DocMetas_1 = require("../../../web/js/metadata/DocMetas");
const Flashcards_1 = require("../../../web/js/metadata/Flashcards");
const DocAnnotations_1 = require("../../../web/js/annotation_sidebar/DocAnnotations");
const FlashcardTaskActions_1 = require("../../repository/js/reviewer/cards/FlashcardTaskActions");
const Reviewer_1 = require("../../repository/js/reviewer/Reviewer");
const ReactRouters_1 = require("../../../web/js/react/router/ReactRouters");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ReviewerStore_1 = require("../../repository/js/reviewer/ReviewerStore");
const createFlashcardTaskReps = () => {
    const docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
    const pageMeta = Object.values(docMeta.pageMetas)[0];
    const ref = Refs_1.Refs.create('1234', 'text-highlight');
    const createFrontAndBackAction = (front, back) => {
        const flashcard = Flashcards_1.Flashcards.createFrontBack(front, back, ref);
        const docAnnotation = DocAnnotations_1.DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions_1.FlashcardTaskActions.create(flashcard, docAnnotation);
        return flashcardTaskActions[0];
    };
    const createClozeAction = (text) => {
        const flashcard = Flashcards_1.Flashcards.createCloze(text, ref);
        const docAnnotation = DocAnnotations_1.DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions_1.FlashcardTaskActions.create(flashcard, docAnnotation);
        return flashcardTaskActions[0];
    };
    const tasks = [
        {
            id: "10102",
            action: createClozeAction('The capital of California is {{c1::Sacramento}}.'),
            created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10103",
            action: createFrontAndBackAction('What is the capital of the United States? ', 'Washington, DC'),
            created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10104",
            action: createFrontAndBackAction('Who let the dogs out?', 'woof, woof, woof, woof.'),
            created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10105",
            action: createFrontAndBackAction('Who is your daddy and what does he do?', "It's not a tumor!"),
            created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        }
    ];
    return tasks.map(task => TasksCalculator_1.TasksCalculator.createInitialLearningState(task));
};
const taskReps = createFlashcardTaskReps();
const ReviewerStats = () => {
    const { ratings, hasSuspended, hasFinished } = ReviewerStore_1.useReviewerStore(['ratings', 'hasSuspended', 'hasFinished']);
    return (React.createElement("div", null,
        React.createElement("b", null, "suspended:"),
        " ",
        hasSuspended ? 'true' : 'false',
        " ",
        React.createElement("br", null),
        React.createElement("b", null, "finished:"),
        " ",
        hasFinished ? 'true' : 'false',
        " ",
        React.createElement("br", null),
        React.createElement("b", null, "ratings:"),
        " ",
        ratings.join(', '),
        " ",
        React.createElement("br", null)));
};
exports.ReviewerStory = () => {
    const [open, setOpen] = React.useState(false);
    const doRating = React.useCallback((taskRep, rating) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("onRating: ", { taskRep, rating });
    }), []);
    const doSuspended = React.useCallback((taskRep) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("onSuspended: ", { taskRep });
    }), []);
    const doFinished = React.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("onFinished: ");
    }), []);
    console.log("Working with N tasks: ", taskReps.length);
    const reviewerProvider = () => __awaiter(void 0, void 0, void 0, function* () {
        return {
            taskReps,
            doRating,
            doSuspended,
            doFinished
        };
    });
    return (React.createElement(react_router_dom_1.BrowserRouter, { key: "browser-router" },
        React.createElement(react_router_dom_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithPathAndHash() },
            React.createElement(React.Fragment, null,
                open && (React.createElement(Reviewer_1.Reviewer, { reviewerProvider: reviewerProvider })),
                React.createElement(Button_1.default, { variant: "contained", color: "primary", size: "large", onClick: () => setOpen(true) }, "Start Review"),
                React.createElement(ReviewerStats, null)))));
};
//# sourceMappingURL=ReviewerStory.js.map