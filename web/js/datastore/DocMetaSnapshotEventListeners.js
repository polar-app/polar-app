"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMetaSnapshotEventListeners = void 0;
const DocMetaComparisonIndex_1 = require("./DocMetaComparisonIndex");
class DocMetaSnapshotEventListeners {
    static createDeduplicatedListener(outputListener, docMetaComparisonIndex = new DocMetaComparisonIndex_1.DocMetaComparisonIndex()) {
        if (!docMetaComparisonIndex) {
            docMetaComparisonIndex = new DocMetaComparisonIndex_1.DocMetaComparisonIndex();
        }
        const listener = (docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
            const acceptedDocMetaMutations = [];
            for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                const docInfo = yield docMetaMutation.docInfoProvider();
                if (docMetaComparisonIndex.handleDocMetaMutation(docMetaMutation, docInfo)) {
                    acceptedDocMetaMutations.push(docMetaMutation);
                }
            }
            yield outputListener(Object.assign(Object.assign({}, docMetaSnapshotEvent), { docMetaMutations: acceptedDocMetaMutations }));
        });
        return {
            handleDocMetaMutation: docMetaComparisonIndex.handleDocMetaMutation.bind(docMetaComparisonIndex),
            listener,
        };
    }
}
exports.DocMetaSnapshotEventListeners = DocMetaSnapshotEventListeners;
//# sourceMappingURL=DocMetaSnapshotEventListeners.js.map