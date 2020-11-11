"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFileDropzoneRoot = void 0;
const react_1 = __importDefault(require("react"));
const AddFileDropzoneStore_1 = require("./AddFileDropzoneStore");
const AddFileDropzone_1 = require("./AddFileDropzone");
exports.AddFileDropzoneRoot = react_1.default.memo((props) => {
    return (react_1.default.createElement(AddFileDropzoneStore_1.AddFileDropzoneProvider, null,
        react_1.default.createElement(DragAndDropListener, null, props.children)));
});
const DragAndDropListener = react_1.default.memo((props) => {
    AddFileDropzone_1.useDragAndDropBackdropListener();
    AddFileDropzone_1.useDragAndDropImportListener();
    return props.children;
});
//# sourceMappingURL=AddFileDropzoneRoot.js.map