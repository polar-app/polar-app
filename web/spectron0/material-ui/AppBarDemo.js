"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBarDemo = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Menu_1 = __importDefault(require("@material-ui/icons/Menu"));
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));
function AppBarDemo() {
    const classes = useStyles();
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement(AppBar_1.default, { position: "static" },
            react_1.default.createElement(Toolbar_1.default, null,
                react_1.default.createElement(IconButton_1.default, { edge: "start", className: classes.menuButton, color: "inherit", "aria-label": "menu" },
                    react_1.default.createElement(Menu_1.default, null)),
                react_1.default.createElement(Typography_1.default, { variant: "h6", className: classes.title }, "News"),
                react_1.default.createElement(Button_1.default, { color: "secondary", variant: "contained" }, "Login")))));
}
exports.AppBarDemo = AppBarDemo;
//# sourceMappingURL=AppBarDemo.js.map