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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUITreeItem = void 0;
const TreeItem_1 = __importDefault(require("@material-ui/lab/TreeItem"));
const react_1 = __importStar(require("react"));
const MUITreeIcons_1 = require("./MUITreeIcons");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUITreeItemLabel_1 = require("./MUITreeItemLabel");
const DragTarget2_1 = require("../../ui/tree/DragTarget2");
exports.MUITreeItem = react_1.default.memo((props) => {
    const onDrop = react_1.useCallback((event) => {
        props.onDrop(event, props.nodeId);
    }, [props]);
    return (react_1.default.createElement(DragTarget2_1.DragTarget2, { onDrop: onDrop },
        react_1.default.createElement(TreeItem_1.default, { nodeId: props.nodeId, label: react_1.default.createElement(MUITreeItemLabel_1.MUITreeItemLabel, { selectRow: props.selectRow, nodeId: props.nodeId, selected: props.selected, label: props.label, info: props.info }), collapseIcon: react_1.default.createElement(MUITreeIcons_1.CollapseIcon, { nodeId: props.nodeId, onNodeCollapse: props.onNodeCollapse }), expandIcon: react_1.default.createElement(MUITreeIcons_1.ExpandIcon, { nodeId: props.nodeId, onNodeExpand: props.onNodeExpand }), TransitionProps: { timeout: 75 } }, props.childNodes.map((child) => {
            return (react_1.default.createElement(exports.MUITreeItem, { key: child.id, nodeId: child.id, label: child.name, info: child.count, selected: child.value.selected, childNodes: child.children, onNodeExpand: props.onNodeExpand, onNodeCollapse: props.onNodeCollapse, selectRow: props.selectRow, onDrop: props.onDrop }));
        }))));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUITreeItem.js.map