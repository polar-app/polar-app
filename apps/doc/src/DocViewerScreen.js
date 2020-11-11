"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerScreen = void 0;
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUIRepositoryRoot_1 = require("../../../web/js/mui/MUIRepositoryRoot");
const UserTagsProvider2_1 = require("../../repository/js/persistence_layer/UserTagsProvider2");
const DocViewer_1 = require("./DocViewer");
const AnnotationSidebarStore_1 = require("./AnnotationSidebarStore");
const DocMetaContextProvider_1 = require("../../../web/js/annotation_sidebar/DocMetaContextProvider");
const DocViewerStore_1 = require("./DocViewerStore");
const DocFindStore_1 = require("./DocFindStore");
const DocViewerDocMetaLookupContextProvider_1 = require("./DocViewerDocMetaLookupContextProvider");
exports.DocViewerScreen = react_1.default.memo(() => {
    return (react_1.default.createElement("div", { className: "DocViewerScreen", style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0,
        } },
        react_1.default.createElement(MUIRepositoryRoot_1.MUIRepositoryRoot, null,
            react_1.default.createElement(UserTagsProvider2_1.UserTagsProvider, null,
                react_1.default.createElement(DocMetaContextProvider_1.DocMetaContextProvider, null,
                    react_1.default.createElement(DocViewerDocMetaLookupContextProvider_1.DocViewerDocMetaLookupContextProvider, null,
                        react_1.default.createElement(DocViewerStore_1.DocViewerStore, null,
                            react_1.default.createElement(DocFindStore_1.DocFindStore, null,
                                react_1.default.createElement(AnnotationSidebarStore_1.AnnotationSidebarStoreProvider, null,
                                    react_1.default.createElement(DocViewer_1.DocViewer, null))))))))));
}, react_fast_compare_1.default);
//# sourceMappingURL=DocViewerScreen.js.map