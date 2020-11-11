"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIEfficientCheckbox = void 0;
const styles_1 = require("@material-ui/core/styles");
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUIFontAwesome_1 = require("../../../../web/js/mui/MUIFontAwesome");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    active: {
        color: theme.palette.secondary.main
    },
    inactive: {
        color: theme.palette.text.secondary,
    }
}));
exports.MUIEfficientCheckbox = react_1.default.memo((props) => {
    const classes = useStyles();
    if (props.checked) {
        return (react_1.default.createElement(MUIFontAwesome_1.FACheckSquareIcon, { className: props.checked ? classes.active : classes.inactive, style: {
                fontSize: '1.2em',
                margin: '2px'
            } }));
    }
    else {
        return (react_1.default.createElement(MUIFontAwesome_1.FASquareIcon, { className: props.checked ? classes.active : classes.inactive, style: {
                fontSize: '1.2em',
                margin: '2px'
            } }));
    }
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIEfficientCheckbox.js.map