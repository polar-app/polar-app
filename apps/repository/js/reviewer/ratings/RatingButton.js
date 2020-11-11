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
exports.RatingButton = void 0;
const React = __importStar(require("react"));
const TasksCalculator_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator");
const ColorButton_1 = require("../ColorButton");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
exports.RatingButton = ReactUtils_1.deepMemo((props) => {
    const { rating, taskRep, color } = props;
    const spacedRep = TasksCalculator_1.TasksCalculator.computeNextSpacedRep(taskRep, rating);
    const duration = TimeDurations_1.TimeDurations.format(spacedRep.state.interval);
    return (React.createElement(ColorButton_1.ColorButton, { variant: "contained", color: color, size: "large", style: { flexGrow: 1 }, onClick: () => props.onRating(taskRep, rating) }, rating));
});
//# sourceMappingURL=RatingButton.js.map