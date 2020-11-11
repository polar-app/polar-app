"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBViewerContainer = void 0;
const react_1 = __importDefault(require("react"));
const DocViewerStore_1 = require("../../DocViewerStore");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useStyles = makeStyles_1.default(() => createStyles_1.default({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'none',
    },
    viewerContainer: {
        position: 'absolute',
        overflow: 'none',
        top: 0,
        width: '100%',
        height: '100%'
    }
}));
exports.EPUBViewerContainer = ReactUtils_1.memoForwardRef((props) => {
    const classes = useStyles();
    const { page } = DocViewerStore_1.useDocViewerStore(['page']);
    return (react_1.default.createElement("main", { id: "viewerContainer", className: `${classes.container} ${classes.viewerContainer}`, itemProp: "mainContentOfPage" },
        react_1.default.createElement("div", { id: "viewer", className: `${classes.container} epubViewer` },
            react_1.default.createElement("div", { "data-page-number": page, "data-loaded": "true", className: `${classes.container} page`, style: {
                    userSelect: 'none'
                } }),
            props.children)));
});
//# sourceMappingURL=EPUBViewerContainer.js.map