"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIPaperToolbar = void 0;
const react_1 = __importDefault(require("react"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const styles_1 = require("@material-ui/core/styles");
const useStyles = makeStyles_1.default((theme) => {
    const borderColor = theme.palette.type === 'light'
        ? styles_1.lighten(styles_1.fade(theme.palette.divider, 1), 0.88)
        : styles_1.darken(styles_1.fade(theme.palette.divider, 1), 0.68);
    return styles_1.createStyles({
        borderTop: {
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
        },
        borderBottom: {
            borderBottom: `1px solid ${borderColor}`,
        },
    });
});
exports.MUIPaperToolbar = (props) => {
    const classes = useStyles();
    const boxClasses = [
        props.borderTop ? classes.borderTop : undefined,
        props.borderBottom ? classes.borderBottom : undefined,
    ].filter(current => current !== undefined);
    return (react_1.default.createElement(Paper_1.default, { square: true, id: props.id, style: props.style, className: props.className, elevation: props.elevation || 0 },
        react_1.default.createElement(Box_1.default, { className: boxClasses.join(' '), padding: props.padding }, props.children || null)));
};
//# sourceMappingURL=MUIPaperToolbar.js.map