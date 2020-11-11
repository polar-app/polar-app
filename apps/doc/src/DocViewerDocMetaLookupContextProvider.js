"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerDocMetaLookupContextProvider = void 0;
const react_1 = __importDefault(require("react"));
const DocViewerStore_1 = require("./DocViewerStore");
const DocMetaLookupContextProvider_1 = require("../../../web/js/annotation_sidebar/DocMetaLookupContextProvider");
exports.DocViewerDocMetaLookupContextProvider = react_1.default.memo((props) => {
    const { docMeta } = DocViewerStore_1.useDocViewerStore(['docMeta']);
    class DefaultDocMetaLookupContext extends DocMetaLookupContextProvider_1.BaseDocMetaLookupContext {
        lookup(id) {
            if (!docMeta) {
                console.warn("No docMeta currently defined");
                return undefined;
            }
            if (id === docMeta.docInfo.fingerprint) {
                return docMeta;
            }
            console.warn(`DocMeta loaded ${docMeta.docInfo.fingerprint} not ${id}`);
            return undefined;
        }
    }
    const docMetaLookupContext = new DefaultDocMetaLookupContext();
    return (react_1.default.createElement(DocMetaLookupContextProvider_1.DocMetaLookupContext.Provider, { value: docMetaLookupContext }, props.children));
});
//# sourceMappingURL=DocViewerDocMetaLookupContextProvider.js.map