"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUITreeViewDemo = void 0;
const react_1 = __importDefault(require("react"));
const FolderSidebar2_1 = require("../../../../apps/repository/js/folders/FolderSidebar2");
const PersistenceLayerApp_1 = require("../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
function createTagDescriptor(tag, count) {
    return {
        id: tag,
        label: tag,
        count,
        members: []
    };
}
const tagDescriptors = [
    createTagDescriptor('linux', 101),
    createTagDescriptor('microsoft', 200),
    createTagDescriptor('/compsci/linux', 20),
    createTagDescriptor('/compsci/google', 100),
    createTagDescriptor('/compsci/stanford/cs101', 220),
    createTagDescriptor('/compsci/stanford/cs102', 215),
];
const FolderSidebarDemo = () => {
    return (react_1.default.createElement(FolderSidebar2_1.FolderSidebar2, null));
};
const tagsContext = {
    tagsProvider: () => tagDescriptors
};
exports.MUITreeViewDemo = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(PersistenceLayerApp_1.TagsContext.Provider, { value: tagsContext },
            react_1.default.createElement(FolderSidebarDemo, null))));
};
//# sourceMappingURL=MUITreeViewDemo.js.map