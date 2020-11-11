"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseFolderToUpload = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../../react/ReactUtils");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const AddFileHooks_1 = require("./AddFileHooks");
const Uploads_1 = require("./Uploads");
const Folder_1 = __importDefault(require("@material-ui/icons/Folder"));
var useAddFileImporter = AddFileHooks_1.AddFileHooks.useAddFileImporter;
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    input: {
        display: 'none',
    },
}));
exports.BrowseFolderToUpload = ReactUtils_1.deepMemo((props) => {
    const classes = useStyles();
    const id = react_1.default.useMemo(() => '' + Math.floor(10000 * Math.random()), []);
    const addFileImporter = useAddFileImporter();
    const handleInputChange = react_1.default.useCallback((event) => {
        const uploads = Uploads_1.Uploads.fromFiles(event.target.files);
        addFileImporter(uploads);
        props.onClose();
    }, [addFileImporter, props]);
    const inputProps = {
        webkitdirectory: "",
        mozdirectory: "",
        directory: ""
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("input", Object.assign({ className: classes.input, accept: "application/pdf, application/epub+zip, .pdf, .epub, .PDF, .EPUB" }, inputProps, { id: id, multiple: true, onChange: handleInputChange, type: "file" })),
        react_1.default.createElement("label", { htmlFor: id },
            react_1.default.createElement(Button_1.default, { variant: "contained", startIcon: react_1.default.createElement(Folder_1.default, null), size: "large", component: "span", color: "primary" }, "Upload Folder"))));
});
//# sourceMappingURL=BrowseFolderToUpload.js.map