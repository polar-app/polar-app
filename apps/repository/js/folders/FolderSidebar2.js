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
exports.FolderSidebar2 = void 0;
const React = __importStar(require("react"));
const MUITreeView_1 = require("../../../../web/js/mui/treeview/MUITreeView");
const MUITagList_1 = require("./MUITagList");
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const MUISearchBox2_1 = require("../../../../web/js/mui/MUISearchBox2");
const AddTagsDropdown_1 = require("./AddTagsDropdown");
const FolderSidebarStore_1 = require("../folder_sidebar/FolderSidebarStore");
const MUIContextMenu_1 = require("../doc_repo/MUIContextMenu");
const FolderSidebarMenu_1 = require("./FolderSidebarMenu");
const MUIElevation_1 = require("../../../../web/js/mui/MUIElevation");
const FoldersMenu = () => React.createElement(FolderSidebarMenu_1.FolderSidebarMenu, { type: "folder" });
const TagsMenu = () => React.createElement(FolderSidebarMenu_1.FolderSidebarMenu, { type: "tag" });
const FoldersContextMenu = MUIContextMenu_1.createContextMenu(FoldersMenu);
const TagsContextMenu = MUIContextMenu_1.createContextMenu(TagsMenu);
exports.FolderSidebar2 = () => {
    const { filter, foldersRoot, selected, expanded, tagsView } = FolderSidebarStore_1.useFolderSidebarStore(['filter', 'foldersRoot', 'selected', 'expanded', 'tagsView']);
    const { onDrop, onCreateUserTag, setFilter, toggleExpanded, selectRow, collapseNode, expandNode } = FolderSidebarStore_1.useFolderSidebarCallbacks();
    const handleDrop = React.useCallback((event, tagID) => {
        try {
            onDrop(tagID);
        }
        finally {
            event.stopPropagation();
            event.preventDefault();
        }
    }, [onDrop]);
    return (React.createElement(MUIElevation_1.MUIElevation, { className: "FolderSidebar2", elevation: 2, style: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: "column",
            minHeight: 0
        } },
        React.createElement(React.Fragment, null,
            React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true, padding: 0.5 },
                React.createElement("div", { style: {
                        display: 'flex'
                    } },
                    React.createElement(MUISearchBox2_1.MUISearchBox2, { initialValue: filter, placeholder: "Filter by tag or folder", autoComplete: "off", style: {
                            flexGrow: 1
                        }, onChange: setFilter }),
                    React.createElement("div", { className: "ml-1" },
                        React.createElement(AddTagsDropdown_1.AddTagsDropdown, { onCreateFolder: () => onCreateUserTag('folder'), onCreateTag: () => onCreateUserTag('tag') })))),
            React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                } },
                foldersRoot &&
                    React.createElement("div", { style: { marginLeft: '8px' } },
                        React.createElement(FoldersContextMenu, null,
                            React.createElement(MUITreeView_1.MUITreeView, { root: foldersRoot, toggleExpanded: toggleExpanded, selectRow: selectRow, collapseNode: collapseNode, expandNode: expandNode, selected: selected, expanded: expanded, onDrop: handleDrop }))),
                React.createElement(TagsContextMenu, null,
                    React.createElement(MUITagList_1.MUITagList, { tags: tagsView, selected: selected, selectRow: selectRow, onDrop: handleDrop }))))));
};
//# sourceMappingURL=FolderSidebar2.js.map