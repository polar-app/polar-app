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
exports.useDocMetaLookupContext = exports.DocMetaLookupContext = exports.BaseDocMetaLookupContext = void 0;
const react_1 = __importStar(require("react"));
class BaseDocMetaLookupContext {
    lookupAnnotations(annotations) {
        const toDocMetaAnnotationMutationRef = (annotation) => {
            const docMeta = this.lookup(annotation.docMetaRef.id);
            if (!docMeta) {
                throw new Error("Could not resolve docMeta ID: " + annotation.docMetaRef.id);
            }
            return {
                id: annotation.id,
                pageNum: annotation.pageNum,
                annotationType: annotation.annotationType,
                docMetaRef: annotation.docMetaRef,
                original: annotation.original,
                docMeta
            };
        };
        return annotations.map(toDocMetaAnnotationMutationRef);
    }
    lookupAnnotationHolders(annotations) {
        const doLookup = (holder) => {
            const { annotation } = holder;
            const docMeta = this.lookup(annotation.docMetaRef.id);
            if (!docMeta) {
                throw new Error("Could not resolve docMeta ID: " + annotation.docMetaRef.id);
            }
            return {
                annotation: Object.assign(Object.assign({}, annotation), { docMeta }),
                mutation: holder.mutation
            };
        };
        return annotations.map(doLookup);
    }
}
exports.BaseDocMetaLookupContext = BaseDocMetaLookupContext;
class NullDocMetaLookupContext extends BaseDocMetaLookupContext {
    lookup() {
        console.warn("Using default lookup which always returns undefined");
        return undefined;
    }
}
const defaultValue = new NullDocMetaLookupContext();
exports.DocMetaLookupContext = react_1.default.createContext(defaultValue);
function useDocMetaLookupContext() {
    return react_1.useContext(exports.DocMetaLookupContext);
}
exports.useDocMetaLookupContext = useDocMetaLookupContext;
//# sourceMappingURL=DocMetaLookupContextProvider.js.map