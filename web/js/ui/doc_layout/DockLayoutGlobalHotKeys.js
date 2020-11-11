"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockLayoutGlobalHotKeys = void 0;
const React = __importStar(require("react"));
const GlobalKeyboardShortcuts_1 = require("../../keyboard_shortcuts/GlobalKeyboardShortcuts");
const DockLayoutStore_1 = require("./DockLayoutStore");
const globalKeyMap = GlobalKeyboardShortcuts_1.keyMapWithGroup({
    group: "Sidebar Panels",
    groupPriority: -1,
    keyMap: {
        TOGGLE_LEFT: {
            name: "Toggle Left Sidebar Visibility",
            description: "Hide/show the left sidebar",
            sequences: ['[']
        },
        TOGGLE_RIGHT: {
            name: "Toggle Right Sidebar Visibility",
            description: "Hide/show the right sidebar",
            sequences: [']']
        },
    }
});
exports.DockLayoutGlobalHotKeys = React.memo(() => {
    const { toggleSide } = DockLayoutStore_1.useDockLayoutCallbacks();
    const globalKeyHandlers = {
        TOGGLE_LEFT: () => toggleSide('left'),
        TOGGLE_RIGHT: () => toggleSide('right'),
    };
    return (React.createElement(GlobalKeyboardShortcuts_1.GlobalKeyboardShortcuts, { keyMap: globalKeyMap, handlerMap: globalKeyHandlers }));
});
//# sourceMappingURL=DockLayoutGlobalHotKeys.js.map