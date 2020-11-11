"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoSidebarTagStore = exports.useDocRepoSidebarTagStoreCallbacks = exports.useDocRepoSidebarTagStoreStore = exports.DocRepoSidebarTagStoreProvider = void 0;
const react_1 = __importDefault(require("react"));
const FolderSidebarStore_1 = require("../folder_sidebar/FolderSidebarStore");
_a = FolderSidebarStore_1.createFolderSidebarStore(), exports.DocRepoSidebarTagStoreProvider = _a[0], exports.useDocRepoSidebarTagStoreStore = _a[1], exports.useDocRepoSidebarTagStoreCallbacks = _a[2];
const StoreBinder = (props) => {
    return (react_1.default.createElement(FolderSidebarStore_1.FolderSidebarStoreContext.Provider, { value: exports.useDocRepoSidebarTagStoreStore },
        react_1.default.createElement(FolderSidebarStore_1.FolderSidebarCallbacksContext.Provider, { value: exports.useDocRepoSidebarTagStoreCallbacks }, props.children)));
};
exports.DocRepoSidebarTagStore = (props) => {
    return (react_1.default.createElement(exports.DocRepoSidebarTagStoreProvider, null,
        react_1.default.createElement(StoreBinder, null, props.children)));
};
//# sourceMappingURL=DocRepoSidebarTagStore.js.map