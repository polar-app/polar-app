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
exports.StartReviewDropdown = void 0;
const React = __importStar(require("react"));
const MUIMenu_1 = require("../../../../../web/js/mui/menu/MUIMenu");
const RateReview_1 = __importDefault(require("@material-ui/icons/RateReview"));
const MUIRouterLink_1 = require("../../../../../web/js/mui/MUIRouterLink");
const MUIMenuItem_1 = require("../../../../../web/js/mui/menu/MUIMenuItem");
const LocalLibrary_1 = __importDefault(require("@material-ui/icons/LocalLibrary"));
const FlashOn_1 = __importDefault(require("@material-ui/icons/FlashOn"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
exports.StartReviewDropdown = ReactUtils_1.memoForwardRef(() => (React.createElement(MUIMenu_1.MUIMenu, { id: "start-review-dropdown", button: {
        color: "primary",
        text: 'Start Review',
        size: 'large',
        disableRipple: true,
        disableFocusRipple: true,
        icon: React.createElement(RateReview_1.default, null),
        style: {
            minWidth: '285px'
        }
    }, caret: true },
    React.createElement("div", null,
        React.createElement(MUIRouterLink_1.MUIRouterLink, { to: { pathname: '/annotations', hash: '#review-flashcards' } },
            React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Flashcards", icon: React.createElement(FlashOn_1.default, null) })),
        React.createElement(MUIRouterLink_1.MUIRouterLink, { to: { pathname: '/annotations', hash: '#review-reading' } },
            React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Reading", icon: React.createElement(LocalLibrary_1.default, null) }))))));
//# sourceMappingURL=StartReviewDropdown.js.map