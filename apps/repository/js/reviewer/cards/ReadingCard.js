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
exports.ReadingCard = void 0;
const React = __importStar(require("react"));
const TaskBody_1 = require("./TaskBody");
const AnnotationPreview_1 = require("../../annotation_repo/AnnotationPreview");
const RatingButtons_1 = require("../ratings/RatingButtons");
const CardPaper_1 = require("./CardPaper");
exports.ReadingCard = (props) => {
    const taskRep = props.taskRep;
    const { id, action, created, color } = taskRep;
    return (React.createElement(TaskBody_1.TaskBody, { taskRep: taskRep },
        React.createElement(TaskBody_1.TaskBody.Main, { taskRep: taskRep },
            React.createElement(CardPaper_1.CardPaper, null,
                React.createElement(AnnotationPreview_1.AnnotationPreview, { id: id, text: action.docAnnotation.text, img: action.docAnnotation.img, lastUpdated: action.docAnnotation.lastUpdated, created: created, color: color }))),
        React.createElement(TaskBody_1.TaskBody.Footer, { taskRep: taskRep },
            React.createElement(RatingButtons_1.RatingButtons, { taskRep: taskRep, stage: taskRep.stage }))));
};
//# sourceMappingURL=ReadingCard.js.map