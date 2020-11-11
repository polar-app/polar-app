"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerGlobalHotKeys = void 0;
const react_1 = __importDefault(require("react"));
const DocFindStore_1 = require("./DocFindStore");
const DocViewerStore_1 = require("./DocViewerStore");
const react_router_dom_1 = require("react-router-dom");
const ReactRouters_1 = require("../../../web/js/react/router/ReactRouters");
const GlobalKeyboardShortcuts_1 = require("../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts");
var useLocationWithPathOnly = ReactRouters_1.ReactRouters.useLocationWithPathOnly;
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Document Viewer",
    keyMap: {
        FIND: {
            name: "Find",
            description: "Search within the document for the given text.",
            sequences: ['ctrl+f', 'command+f']
        },
        FIND_NEXT: {
            name: "Find Next Match",
            description: "Jump to the next match in the current search results.",
            sequences: ['ctrl+g', 'command+g']
        },
        PAGE_NEXT: {
            name: "Next Page",
            description: "Jump to the next page",
            sequences: ['n', 'j', 'ArrowRight']
        },
        PAGE_PREV: {
            name: "Previous Page",
            description: "Jump to the previous page",
            sequences: ['p', 'k', 'ArrowLeft']
        },
        ZOOM_IN: {
            name: "Zoom In",
            description: "Zoom in to the current document",
            sequences: ['command+shift+=', 'command+=', 'ctrl+shift+=', 'ctrl+=']
        },
        ZOOM_OUT: {
            name: "Zoom Out",
            description: "Zoom out to the current document",
            sequences: ['command+shift+-', 'command+-', 'ctrl+shift+-', 'ctrl+-']
        },
        ZOOM_RESTORE: {
            name: "Zoom Restore",
            description: "Restore the default zoom level",
            sequences: ['command+0', 'ctrl+0']
        },
        TAG: {
            name: "Tag",
            description: "Tag the current document",
            sequences: ['t']
        },
        FLAG: {
            name: "Flag",
            description: "Flag the current document",
            sequences: ['f']
        },
        ARCHIVE: {
            name: "Archive",
            description: "Archive the current document",
            sequences: ['a']
        },
    }
});
exports.DocViewerGlobalHotKeys = react_1.default.memo(() => {
    const findCallbacks = DocFindStore_1.useDocFindCallbacks();
    const { onPagePrev, onPageNext, doZoom, doZoomRestore, onDocTagged, toggleDocArchived, toggleDocFlagged } = DocViewerStore_1.useDocViewerCallbacks();
    const globalKeyHandlers = {
        FIND: () => findCallbacks.setActive(true),
        FIND_NEXT: () => findCallbacks.doFindNext(),
        PAGE_NEXT: onPageNext,
        PAGE_PREV: onPagePrev,
        ZOOM_IN: () => doZoom('+'),
        ZOOM_OUT: () => doZoom('-'),
        ZOOM_RESTORE: doZoomRestore,
        TAG: onDocTagged,
        FLAG: toggleDocFlagged,
        ARCHIVE: toggleDocArchived
    };
    const location = useLocationWithPathOnly();
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Switch, { location: location },
            react_1.default.createElement(react_router_dom_1.Route, { path: ['/pdf', '/doc'] },
                react_1.default.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers })))));
});
//# sourceMappingURL=DocViewerGlobalHotKeys.js.map