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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardCard = exports.FlashcardCardInner = void 0;
const React = __importStar(require("react"));
const TaskBody_1 = require("./TaskBody");
const RatingButtons_1 = require("../ratings/RatingButtons");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const CardPaper_1 = require("./CardPaper");
const FlashcardStore_1 = require("./FlashcardStore");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const FlashcardGlobalHotKeys_1 = require("./FlashcardGlobalHotKeys");
var card;
(function (card) {
    card.Body = (props) => {
        return (React.createElement(CardPaper_1.CardPaper, null, props.children));
    };
    card.Parent = (props) => (React.createElement("div", { className: "mt-3 pl-3 pr-3 flashcard-parent", style: {
            width: '100%',
        } }, props.children));
})(card || (card = {}));
const FrontCard = (props) => (React.createElement(card.Parent, null,
    React.createElement(card.Body, null, props.children)));
const FrontAndBackCard = (props) => (React.createElement(card.Parent, null,
    React.createElement(card.Body, null,
        React.createElement("div", { className: "mb-4" }, props.front),
        React.createElement(Divider_1.default, null),
        React.createElement("div", { className: "mt-4" }, props.back))));
exports.FlashcardCardInner = ReactUtils_1.deepMemo((props) => {
    const { side } = FlashcardStore_1.useFlashcardStore(['side']);
    const { setSide } = FlashcardStore_1.useFlashcardCallbacks();
    React.useMemo(() => setSide('front'), [setSide]);
    const handleShowAnswer = React.useCallback(() => {
        setSide('back');
    }, [setSide]);
    Preconditions_1.Preconditions.assertPresent(props.front, 'front');
    Preconditions_1.Preconditions.assertPresent(props.back, 'back');
    const { taskRep } = props;
    const Main = () => {
        switch (side) {
            case 'front':
                return (React.createElement(FrontCard, null, props.front));
            case 'back':
                return (React.createElement(FrontAndBackCard, { front: props.front, back: props.back }));
            default:
                throw new Error("Invalid side: " + side);
        }
    };
    const Buttons = () => {
        switch (side) {
            case 'front':
                return (React.createElement(Button_1.default, { color: "primary", variant: "contained", size: "large", onClick: handleShowAnswer }, "Show Answer"));
            case 'back':
                return (React.createElement(RatingButtons_1.RatingButtons, { taskRep: taskRep, stage: taskRep.stage }));
            default:
                throw new Error("Invalid side: " + side);
        }
    };
    return (React.createElement(TaskBody_1.TaskBody, { taskRep: taskRep },
        React.createElement(TaskBody_1.TaskBody.Main, { taskRep: taskRep },
            React.createElement(Main, null)),
        React.createElement(TaskBody_1.TaskBody.Footer, { taskRep: taskRep },
            React.createElement("div", { className: "mt-2 mb-2" },
                React.createElement(Buttons, null)))));
});
exports.FlashcardCard = (props) => {
    return (React.createElement(FlashcardStore_1.FlashcardStoreProvider, null,
        React.createElement(React.Fragment, null,
            React.createElement(FlashcardGlobalHotKeys_1.FlashcardGlobalHotKeys, null),
            React.createElement(exports.FlashcardCardInner, Object.assign({}, props)))));
};
//# sourceMappingURL=FlashcardCard.js.map