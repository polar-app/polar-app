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
exports.MUIToggleButton = void 0;
const React = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Check_1 = __importDefault(require("@material-ui/icons/Check"));
const styles_1 = require("@material-ui/core/styles");
const DeviceRouter_1 = require("./DeviceRouter");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUITooltip_1 = require("../mui/MUITooltip");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    buttonActive: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
        }
    },
    button: {
        color: theme.palette.text.secondary,
    }
}));
exports.MUIToggleButton = React.memo((props) => {
    const classes = useStyles();
    const [active, setActive] = React.useState(props.initialValue);
    const handleToggle = () => {
        const newActive = !active;
        setActive(newActive);
        setTimeout(() => props.onChange(newActive), 1);
    };
    const size = props.size || 'medium';
    const icon = props.icon || React.createElement(Check_1.default, null);
    return (React.createElement(MUITooltip_1.MUITooltip, { title: props.tooltip },
        React.createElement(Button_1.default, { id: props.id, startIcon: icon, className: active ? classes.buttonActive : classes.button, onClick: handleToggle, variant: active ? "contained" : "outlined", disableFocusRipple: true, disableRipple: true, size: size },
            React.createElement(DeviceRouter_1.DeviceRouters.NotPhone, null,
                React.createElement(React.Fragment, null, props.label)))));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIToggleButton.js.map