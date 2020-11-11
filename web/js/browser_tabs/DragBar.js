"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragBar = void 0;
const react_1 = __importDefault(require("react"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useStyles = makeStyles_1.default(() => ({
    root: {
        "-webkit-app-region": "drag",
        height: '10px'
    }
}));
exports.DragBar = react_1.default.memo(() => {
    const classes = useStyles();
    return react_1.default.createElement("div", { className: classes.root });
});
//# sourceMappingURL=DragBar.js.map