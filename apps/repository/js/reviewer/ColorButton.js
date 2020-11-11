"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorButton = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const styles_1 = require("@material-ui/core/styles");
const useStyles = makeStyles_1.default((theme) => {
    return styles_1.createStyles({
        root: (props) => ({
            color: theme.palette.getContrastText(props.color),
            backgroundColor: props.color,
            '&:hover': {
                backgroundColor: styles_1.darken(props.color, 0.3),
            },
        }),
    });
});
exports.ColorButton = react_1.default.memo((props) => {
    const classes = useStyles(props);
    const buttonProps = Object.assign({}, props);
    delete buttonProps.color;
    return (react_1.default.createElement(Button_1.default, Object.assign({ className: `${classes.root}` }, buttonProps), props.children));
}, react_fast_compare_1.default);
//# sourceMappingURL=ColorButton.js.map