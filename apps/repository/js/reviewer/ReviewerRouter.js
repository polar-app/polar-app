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
exports.ReviewRouter = void 0;
const AnnotationRepoStore_1 = require("../annotation_repo/AnnotationRepoStore");
const react_router_dom_1 = require("react-router-dom");
const ReactRouters_1 = require("../../../../web/js/react/router/ReactRouters");
const LeftSidebar_1 = require("../../../../web/js/ui/motion/LeftSidebar");
const ReviewerScreen_1 = require("./ReviewerScreen");
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
exports.ReviewRouter = () => {
    const store = AnnotationRepoStore_1.useAnnotationRepoStore(['view']);
    return (React.createElement(react_router_dom_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithHashOnly() },
        React.createElement(react_router_dom_1.Route, { path: '#folders', render: () => (React.createElement(LeftSidebar_1.LeftSidebar, { onClose: Functions_1.NULL_FUNCTION })) }),
        React.createElement(react_router_dom_1.Route, { path: '#review-flashcards' },
            React.createElement(ReviewerScreen_1.ReviewerScreen, { mode: "flashcard", annotations: store.view })),
        React.createElement(react_router_dom_1.Route, { path: '#review-reading' },
            React.createElement(ReviewerScreen_1.ReviewerScreen, { mode: "reading", annotations: store.view }))));
};
//# sourceMappingURL=ReviewerRouter.js.map