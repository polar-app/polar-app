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
exports.DocMetadataEditorStory = void 0;
const React = __importStar(require("react"));
const DocMetadataEditor_1 = require("../../repository/js/doc_repo/doc_metadata_editor/DocMetadataEditor");
const Functions_1 = require("polar-shared/src/util/Functions");
const PagemarkType_1 = require("polar-shared/src/metadata/PagemarkType");
const docInfo = {
    title: "Zombies Invade Paris",
    fingerprint: '10101',
    progress: 0,
    pagemarkType: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
    properties: {},
    attachments: {},
    archived: false,
    flagged: false,
    nrPages: 1,
    authors: ['Alice Smith', 'Bob Young']
};
exports.DocMetadataEditorStory = () => {
    return (React.createElement("div", { style: { width: '600px', margin: '5px' } },
        React.createElement(DocMetadataEditor_1.DocMetadataEditor, { docInfo: docInfo, onUpdate: Functions_1.NULL_FUNCTION })));
};
//# sourceMappingURL=DocMetadataEditorStory.js.map