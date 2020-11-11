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
exports.ReviewFinished = exports.NoTasks = exports.CloudSyncRequired = void 0;
const React = __importStar(require("react"));
const CheckedSVGIcon_1 = require("../../../../web/js/ui/svg_icons/CheckedSVGIcon");
const SVGIcon_1 = require("../../../../web/js/ui/svg_icons/SVGIcon");
const react_router_dom_1 = require("react-router-dom");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ReviewerStore_1 = require("./ReviewerStore");
const ReviewLayout = (props) => {
    const history = react_router_dom_1.useHistory();
    const { onReset } = ReviewerStore_1.useReviewerCallbacks();
    const onContinue = React.useCallback(() => {
        onReset();
        history.replace({ pathname: '/annotations', hash: "" });
    }, [history, onReset]);
    return (React.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        } },
        React.createElement("div", { className: "text-center m-2", style: { flexGrow: 1 } }, props.children),
        React.createElement("div", { className: "text-center m-2" },
            React.createElement(Button_1.default, { variant: "contained", color: "primary", size: "large", onClick: onContinue }, "CONTINUE"))));
};
exports.CloudSyncRequired = () => (React.createElement(ReviewLayout, null,
    React.createElement("div", { className: "text-center p-5" },
        React.createElement("h2", null, "Cloud sync required (please login)"),
        React.createElement("div", { className: "p-3" },
            React.createElement("i", { className: "fas fa-cloud-upload-alt text-danger", style: { fontSize: '125px' } })),
        React.createElement("h3", { className: "text-muted" }, "Cloud sync is required to review annotations.  Please login to review flashcards and reading."))));
exports.NoTasks = () => (React.createElement(ReviewLayout, null,
    React.createElement("div", { className: "text-center p-5" },
        React.createElement("h2", null, "No tasks to complete"),
        React.createElement("div", { className: "p-3" },
            React.createElement("i", { className: "far fa-check-circle text-primary", style: { fontSize: '125px' } })),
        React.createElement("h3", { className: "text-muted" }, "Try creating some flashcards and let's try this again."))));
exports.ReviewFinished = () => (React.createElement(ReviewLayout, null,
    React.createElement("div", { className: "text-center m-2", style: { flexGrow: 1 } },
        React.createElement("div", { className: "m-2" },
            React.createElement(SVGIcon_1.SVGIcon, { size: 200 },
                React.createElement(CheckedSVGIcon_1.CheckedSVGIcon, null))),
        React.createElement("h2", null, "Review Completed!"),
        React.createElement("p", { className: "text-muted text-xl" }, "Nice.  Every time you review you're getting smarter and a step closer to your goal.  Great work!"))));
//# sourceMappingURL=ReviewFinished.js.map