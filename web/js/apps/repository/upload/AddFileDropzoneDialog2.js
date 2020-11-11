"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFileDropzoneDialog2 = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const BrowseFolderToUpload_1 = require("./BrowseFolderToUpload");
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const CloudUpload_1 = __importDefault(require("@material-ui/icons/CloudUpload"));
const BrowseFilesToUpload_1 = require("./BrowseFilesToUpload");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    dropbox: {
        borderRadius: '10px',
        borderStyle: 'dashed',
        borderWidth: '3px',
        borderColor: theme.palette.primary.light,
        minWidth: '400px',
        minHeight: '250px',
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
        padding: '20px'
    },
    title: {
        marginTop: '10px',
        marginBottom: '10px',
        fontSize: '3.5em',
    },
    description: {
        fontSize: '1.7em',
        marginBottom: '10px'
    },
    explainer: {
        fontSize: '1.3em',
        color: theme.palette.text.secondary
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));
exports.AddFileDropzoneDialog2 = react_1.default.memo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement(Dialog_1.default, { transitionDuration: 50, maxWidth: "lg", className: classes.backdrop, onClose: props.onClose, open: props.open },
        react_1.default.createElement("div", { className: classes.dropbox },
            react_1.default.createElement("p", { className: classes.title }, "Drag and Drop"),
            react_1.default.createElement("p", null,
                react_1.default.createElement(CloudUpload_1.default, { style: { fontSize: '75px' } })),
            react_1.default.createElement("p", { className: classes.description }, "Drag and Drop PDF and EPUB files here to upload"),
            react_1.default.createElement("p", { className: classes.explainer }, "Selecting a directory will also include all files in all subdirectories"),
            react_1.default.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'center'
                } },
                react_1.default.createElement("div", { className: "mr-1" },
                    react_1.default.createElement(BrowseFilesToUpload_1.BrowseFilesToUpload, { onClose: props.onClose })),
                react_1.default.createElement("div", { className: "ml-1" },
                    react_1.default.createElement(BrowseFolderToUpload_1.BrowseFolderToUpload, { onClose: props.onClose }))))));
});
//# sourceMappingURL=AddFileDropzoneDialog2.js.map