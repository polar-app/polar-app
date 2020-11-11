"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDocument = void 0;
const react_1 = __importDefault(require("react"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const LinkOff_1 = __importDefault(require("@material-ui/icons/LinkOff"));
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },
    icon: {
        fontSize: '250px'
    }
}));
exports.NoDocument = () => {
    const classes = useStyles();
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement(LinkOff_1.default, { className: classes.icon }),
        react_1.default.createElement("h1", null, "Ouch.  No document found for this ID.")));
};
//# sourceMappingURL=NoDocument.js.map