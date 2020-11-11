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
exports.AbstractPersistenceLayer = void 0;
const DocMetas_1 = require("../metadata/DocMetas");
class AbstractPersistenceLayer {
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const onSnapshot = (snapshot) => {
                if (snapshot.data) {
                    const docMeta = DocMetas_1.DocMetas.deserialize(snapshot.data, opts.fingerprint);
                    opts.onSnapshot(Object.assign(Object.assign({}, snapshot), { data: docMeta }));
                }
                else {
                    opts.onSnapshot(Object.assign(Object.assign({}, snapshot), { data: undefined }));
                }
            };
            return yield this.datastore.getDocMetaSnapshot({
                fingerprint: opts.fingerprint,
                onSnapshot: snapshot => onSnapshot(snapshot),
                onError: opts.onError
            });
        });
    }
}
exports.AbstractPersistenceLayer = AbstractPersistenceLayer;
//# sourceMappingURL=PersistenceLayer.js.map