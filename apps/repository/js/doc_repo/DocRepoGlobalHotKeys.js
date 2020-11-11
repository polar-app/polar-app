"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoGlobalHotKeys = void 0;
const react_1 = __importDefault(require("react"));
const DocRepoStore2_1 = require("./DocRepoStore2");
const react_router_dom_1 = require("react-router-dom");
const ReactRouters_1 = require("../../../../web/js/react/router/ReactRouters");
var useLocationWithPathOnly = ReactRouters_1.ReactRouters.useLocationWithPathOnly;
const GlobalKeyboardShortcuts_1 = require("../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts");
const DocMetadataEditorHook_1 = require("./doc_metadata_editor/DocMetadataEditorHook");
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Documents",
    keyMap: {
        TAG: {
            name: "Tag",
            description: "Tag the currently selected document.",
            sequences: ['t'],
        },
        DELETE: {
            name: "Delete",
            description: "Delete the currently selected item.",
            sequences: ['Delete', 'Backspace'],
        },
        FLAG: {
            name: "Flag",
            description: "Flag the currently selected document",
            sequences: ['f']
        },
        ARCHIVE: {
            name: "Archive",
            description: "Archive the currently selected document.  Once archived the item is not visible by default.",
            sequences: ['a']
        },
        RENAME: {
            name: "Rename",
            description: "Rename the current document and assign it a new title.",
            sequences: ['r']
        },
        OPEN: {
            name: "Open",
            description: "Open the current document in the document viewer",
            sequences: ['Enter']
        },
        UPDATE_METADATA: {
            name: "Update Document Metadata",
            description: "Update document metadata and additional fields like authors, abstract, etc.",
            sequences: ['m']
        },
    }
});
exports.DocRepoGlobalHotKeys = react_1.default.memo(() => {
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const docMetadataEditorForSelected = DocMetadataEditorHook_1.useDocMetadataEditorForSelected();
    const globalKeyHandlers = {
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived,
        RENAME: callbacks.onRename,
        OPEN: callbacks.onOpen,
        UPDATE_METADATA: docMetadataEditorForSelected
    };
    const location = useLocationWithPathOnly();
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Switch, { location: location },
            react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                react_1.default.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers })))));
});
//# sourceMappingURL=DocRepoGlobalHotKeys.js.map