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
exports.ColorButton = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const styles_1 = require("@material-ui/core/styles");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    selected: {
        border: `2px solid ${theme.palette.info.dark}`
    },
    notSelected: {
        border: '2px solid rgba(0, 0, 0, 0.1)'
    }
}));
exports.ColorButton = (props) => {
    const classes = useStyles();
    const createBackgroundColor = () => {
        switch (props.color) {
            case 'yellow':
                return 'rgba(255,255,0)';
            case 'red':
                return 'rgba(255,0,0)';
            case 'green':
                return 'rgba(0,255,0)';
            default:
                return props.color;
        }
    };
    const backgroundColor = createBackgroundColor();
    const onSelected = props.onSelected || Functions_1.NULL_FUNCTION;
    const size = props.size || '30px';
    const buttonClassName = props.selected ? classes.selected : classes.notSelected;
    return React.createElement("div", { className: "ml-1 mr-1", style: {
            display: 'flex',
        } },
        React.createElement("button", { id: props.id, className: buttonClassName, title: "", "aria-label": "", onClick: () => onSelected(props.color), style: {
                backgroundColor,
                width: size,
                height: size
            } }));
};
//# sourceMappingURL=ColorButton.js.map