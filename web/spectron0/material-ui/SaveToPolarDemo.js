"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveToPolarDemo = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
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
exports.SaveToPolarDemo = () => {
    const classes = useStyles();
    return (react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
        react_1.default.createElement(AppBar_1.default, { position: "static", color: "inherit" },
            react_1.default.createElement(Toolbar_1.default, null,
                react_1.default.createElement(Typography_1.default, { variant: "h6", className: classes.title }, "Polar"),
                react_1.default.createElement(Button_1.default, { color: "inherit" }, "Login"))),
        react_1.default.createElement(LinearProgress_1.default, null),
        react_1.default.createElement("div", { style: { display: 'flex' } },
            react_1.default.createElement("div", { style: {
                    margin: 'auto',
                    maxWidth: '850px',
                    flexGrow: 1
                } },
                react_1.default.createElement("p", null, "This is the main content.")))));
};
//# sourceMappingURL=SaveToPolarDemo.js.map