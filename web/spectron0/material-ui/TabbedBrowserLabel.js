"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabbedBrowserLabel = void 0;
const react_1 = __importDefault(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Close_1 = __importDefault(require("@material-ui/icons/Close"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const useStyles = makeStyles_1.default((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
    },
    label: {
        flexGrow: 1,
        flexShrink: 1,
        textAlign: 'left',
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    icon: {},
    iconButton: {
        height: '1.0rem',
        width: '1.0rem'
    },
}));
exports.TabbedBrowserLabel = (props) => {
    const classes = useStyles();
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement(Divider_1.default, { orientation: "vertical" }),
        react_1.default.createElement("div", { className: classes.label }, props.label),
        react_1.default.createElement("div", { className: classes.icon },
            react_1.default.createElement(IconButton_1.default, { size: "small" },
                react_1.default.createElement(Close_1.default, { fontSize: "small" })))));
};
//# sourceMappingURL=TabbedBrowserLabel.js.map