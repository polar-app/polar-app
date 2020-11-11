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
exports.ReviewerRunner = void 0;
const React = __importStar(require("react"));
const Percentages_1 = require("polar-shared/src/util/Percentages");
const ReviewFinished_1 = require("./ReviewFinished");
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
const ReviewerCard_1 = require("./cards/ReviewerCard");
const ReviewerStore_1 = require("./ReviewerStore");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const MUILoading_1 = require("../../../../web/js/mui/MUILoading");
exports.ReviewerRunner = ReactUtils_1.deepMemo(() => {
    const { taskRep, finished, total, initialized } = ReviewerStore_1.useReviewerStore(['taskRep', 'finished', 'total', 'initialized']);
    if (!initialized) {
        return React.createElement(MUILoading_1.MUILoading, null);
    }
    if (!taskRep) {
        return (React.createElement(ReviewFinished_1.ReviewFinished, null));
    }
    const perc = Math.floor(Percentages_1.Percentages.calculate(finished, total));
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "mb-1" },
            React.createElement(LinearProgress_1.default, { variant: "determinate", color: "primary", value: perc })),
        React.createElement(ReviewerCard_1.ReviewerCard, { key: taskRep.id, taskRep: taskRep })));
});
//# sourceMappingURL=ReviewerRunner.js.map