"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentWriteStatus = void 0;
const react_1 = __importDefault(require("react"));
const DocumentSaved_1 = require("./DocumentSaved");
const DocumentSaving_1 = require("./DocumentSaving");
const DocViewerStore_1 = require("../../../../../apps/doc/src/DocViewerStore");
const ReactUtils_1 = require("../../../react/ReactUtils");
exports.DocumentWriteStatus = ReactUtils_1.deepMemo(() => {
    const { hasPendingWrites } = DocViewerStore_1.useDocViewerStore(['hasPendingWrites']);
    switch (hasPendingWrites) {
        case true:
            return react_1.default.createElement(DocumentSaving_1.DocumentSaving, null);
        case false:
            return react_1.default.createElement(DocumentSaved_1.DocumentSaved, null);
        default:
            return null;
    }
});
//# sourceMappingURL=DocumentWriteStatus.js.map