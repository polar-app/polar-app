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
exports.ReviewRatingButtons = void 0;
const React = __importStar(require("react"));
const RatingButtonSet_1 = require("./RatingButtonSet");
const red_1 = __importDefault(require("@material-ui/core/colors/red"));
const green_1 = __importDefault(require("@material-ui/core/colors/green"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const ReviewRatingGlobalHotKeys_1 = require("./ReviewRatingGlobalHotKeys");
const BUTTONS = [
    {
        rating: 'again',
        color: red_1.default[500]
    },
    {
        rating: 'hard',
        color: red_1.default[200]
    },
    {
        rating: 'good',
        color: green_1.default[200]
    },
    {
        rating: 'easy',
        color: green_1.default[500]
    },
];
exports.ReviewRatingButtons = ReactUtils_1.deepMemo(function (props) {
    return (React.createElement(React.Fragment, null,
        React.createElement(ReviewRatingGlobalHotKeys_1.ReviewRatingGlobalHotKeys, null),
        React.createElement(RatingButtonSet_1.RatingButtonSet, { taskRep: props.taskRep, options: BUTTONS })));
});
//# sourceMappingURL=ReviewRatingButtons.js.map