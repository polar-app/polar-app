"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGlobalHotKeys = void 0;
const react_1 = __importDefault(require("react"));
const DocRepoStore2_1 = require("./doc_repo/DocRepoStore2");
const react_router_dom_1 = require("react-router-dom");
const GlobalKeyboardShortcuts_1 = require("../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts");
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Navigation",
    keyMap: {
        DOCUMENTS: {
            name: "Go to Documents",
            description: "Go to the documents view.",
            sequences: ['command+1', 'ctrl+1']
        }
    }
});
exports.NavigationGlobalHotKeys = react_1.default.memo(() => {
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const history = react_router_dom_1.useHistory();
    const handleNavToDocuments = react_1.default.useCallback(() => {
        history.push("/");
    }, [history]);
    const handleNavToAnnotations = react_1.default.useCallback(() => {
        history.push("/annotations");
    }, [history]);
    const handleNavToStatistics = react_1.default.useCallback(() => {
        history.push("/statistics");
    }, [history]);
    const globalKeyHandlers = {
        DOCUMENTS: handleNavToDocuments
    };
    return (react_1.default.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers }));
});
//# sourceMappingURL=NavigationGlobalHotKeys.js.map