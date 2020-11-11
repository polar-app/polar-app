"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIBrowserLinks = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const blue_1 = __importDefault(require("@material-ui/core/colors/blue"));
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    root: {
        "& a:link": {
            color: blue_1.default[300],
        },
        "& a:visited": {
            color: blue_1.default[600],
        },
        "& a:hover": {
            color: blue_1.default[400],
        },
        "& a:active": {
            color: blue_1.default[500],
        },
    },
}));
exports.MUIBrowserLinks = ReactUtils_1.deepMemo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement("div", { className: classes.root }, props.children));
});
//# sourceMappingURL=MUIBrowserLinks.js.map