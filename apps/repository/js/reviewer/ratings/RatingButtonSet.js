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
exports.RatingButtonSet = void 0;
const React = __importStar(require("react"));
const MUIButtonBar_1 = require("../../../../../web/js/mui/MUIButtonBar");
const RatingButton_1 = require("./RatingButton");
const ReviewerStore_1 = require("../ReviewerStore");
exports.RatingButtonSet = function (props) {
    const { options, taskRep } = props;
    const { onRating } = ReviewerStore_1.useReviewerCallbacks();
    const handleRating = React.useCallback((taskRep, rating) => {
        onRating(taskRep, rating);
    }, [onRating]);
    return (React.createElement(MUIButtonBar_1.MUIButtonBar, null, options.map(option => (React.createElement(RatingButton_1.RatingButton, { key: option.rating, taskRep: taskRep, rating: option.rating, color: option.color, onRating: () => handleRating(taskRep, option.rating) })))));
};
//# sourceMappingURL=RatingButtonSet.js.map