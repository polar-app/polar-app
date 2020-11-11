"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUISelected = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const styles_1 = require("@material-ui/core/styles");
const clsx_1 = __importDefault(require("clsx"));
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        '&:hover': {
            background: theme.palette.action.hover
        },
        '&$selected, &$selected:hover': {
            backgroundColor: styles_1.fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
        },
    },
    selected: {},
    hover: {},
}));
exports.MUISelected = ReactUtils_1.deepMemo((props) => {
    const classes = useStyles();
    const { selected, className } = props;
    return (react_1.default.createElement("div", { className: clsx_1.default(classes.root, {
            [classes.selected]: selected,
        }, className), style: props.style }, props.children));
});
//# sourceMappingURL=MUISelected.js.map