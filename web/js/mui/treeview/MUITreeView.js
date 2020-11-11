"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUITreeView = void 0;
const react_1 = __importDefault(require("react"));
const TreeView_1 = __importDefault(require("@material-ui/lab/TreeView"));
const MUITreeItem_1 = require("./MUITreeItem");
const ReactUtils_1 = require("../../react/ReactUtils");
exports.MUITreeView = ReactUtils_1.memoForwardRef((props) => {
    return (react_1.default.createElement(TreeView_1.default, { selected: [], expanded: [...props.expanded] },
        react_1.default.createElement(MUITreeItem_1.MUITreeItem, { nodeId: props.root.id, label: "Folders", info: props.root.value.count, selected: props.root.value.selected, onNodeExpand: props.expandNode, onNodeCollapse: props.collapseNode, selectRow: props.selectRow, childNodes: props.root.children, onDrop: props.onDrop })));
});
//# sourceMappingURL=MUITreeView.js.map