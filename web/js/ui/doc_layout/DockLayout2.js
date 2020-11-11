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
exports.DockLayout2 = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
const DockLayoutManager_1 = require("./DockLayoutManager");
const DockLayoutStore_1 = require("./DockLayoutStore");
const DockLayoutGlobalHotKeys_1 = require("./DockLayoutGlobalHotKeys");
const Functions_1 = require("polar-shared/src/util/Functions");
const createInitialPanels = (dockPanels) => {
    const panels = {};
    for (const docPanel of dockPanels) {
        if (docPanel.type === 'fixed') {
            panels[docPanel.id] = {
                id: docPanel.id,
                width: docPanel.width || 400,
                side: docPanel.side,
                collapsed: docPanel.collapsed || false
            };
        }
    }
    return panels;
};
exports.DockLayout2 = ReactUtils_1.deepMemo((props) => {
    const panels = React.useMemo(() => createInitialPanels(props.dockPanels), [props.dockPanels]);
    const store = React.useMemo(() => {
        return {
            panels,
            onResize: props.onResize || Functions_1.NULL_FUNCTION
        };
    }, [panels, props.onResize]);
    return (React.createElement(DockLayoutStore_1.DockLayoutStoreProvider, { store: store },
        React.createElement(React.Fragment, null,
            React.createElement(DockLayoutGlobalHotKeys_1.DockLayoutGlobalHotKeys, null),
            React.createElement(DockLayoutManager_1.DockLayoutManager, Object.assign({}, props)))));
});
//# sourceMappingURL=DockLayout2.js.map