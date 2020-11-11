"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressDialog = void 0;
const react_1 = __importDefault(require("react"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const styles_1 = require("@material-ui/core/styles");
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
const LinearProgressWithLabel_1 = require("./LinearProgressWithLabel");
const MUIDialog_1 = require("./MUIDialog");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {},
    dialogContent: {
        paddingTop: '20px',
        paddingBottom: '20px'
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '1.00rem',
        color: theme.palette.text.secondary,
        paddingTop: '15px',
        paddingBottom: '15px'
    },
    progressArea: {
        paddingTop: '15px',
        paddingBottom: '5px',
    }
}));
exports.ProgressDialog = (props) => {
    const classes = useStyles();
    const open = props.value !== 100;
    return (react_1.default.createElement(MUIDialog_1.MUIDialog, { open: open },
        react_1.default.createElement("div", { className: classes.root },
            react_1.default.createElement(DialogContent_1.default, { className: classes.dialogContent },
                react_1.default.createElement("div", { style: {
                        display: 'flex',
                        flexWrap: 'nowrap',
                        alignItems: 'center'
                    } },
                    props.icon && (react_1.default.createElement("div", { style: { paddingRight: '25px' } }, props.icon)),
                    react_1.default.createElement("div", { style: { flexGrow: 1 } },
                        react_1.default.createElement("div", { id: "form-dialog-title", className: classes.title }, props.title),
                        react_1.default.createElement("div", { className: classes.description },
                            react_1.default.createElement("div", null, props.description)),
                        react_1.default.createElement("div", { className: classes.progressArea },
                            props.value === 'indeterminate' &&
                                react_1.default.createElement(LinearProgress_1.default, { variant: "indeterminate" }),
                            props.value !== 'indeterminate' &&
                                react_1.default.createElement(LinearProgressWithLabel_1.LinearProgressWithLabel, { variant: "determinate", value: props.value }))))))));
};
//# sourceMappingURL=ProgressDialog.js.map