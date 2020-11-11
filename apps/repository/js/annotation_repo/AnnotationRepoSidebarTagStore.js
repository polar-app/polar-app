"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRepoSidebarTagStore = exports.useAnnotationRepoSidebarTagStoreCallbacks = exports.useAnnotationRepoSidebarTagStoreStore = exports.AnnotationRepoSidebarTagStoreProvider = void 0;
const react_1 = __importDefault(require("react"));
const FolderSidebarStore_1 = require("../folder_sidebar/FolderSidebarStore");
_a = FolderSidebarStore_1.createFolderSidebarStore(), exports.AnnotationRepoSidebarTagStoreProvider = _a[0], exports.useAnnotationRepoSidebarTagStoreStore = _a[1], exports.useAnnotationRepoSidebarTagStoreCallbacks = _a[2];
const StoreBinder = (props) => {
    return (react_1.default.createElement(FolderSidebarStore_1.FolderSidebarStoreContext.Provider, { value: exports.useAnnotationRepoSidebarTagStoreStore },
        react_1.default.createElement(FolderSidebarStore_1.FolderSidebarCallbacksContext.Provider, { value: exports.useAnnotationRepoSidebarTagStoreCallbacks }, props.children)));
};
exports.AnnotationRepoSidebarTagStore = (props) => {
    return (react_1.default.createElement(exports.AnnotationRepoSidebarTagStoreProvider, null,
        react_1.default.createElement(StoreBinder, null, props.children)));
};
//# sourceMappingURL=AnnotationRepoSidebarTagStore.js.map