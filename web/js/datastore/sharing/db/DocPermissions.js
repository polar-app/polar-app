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
exports.DocPermissions = void 0;
const FirebaseDatastore_1 = require("../../FirebaseDatastore");
const Firestore_1 = require("../../../firebase/Firestore");
class DocPermissions {
    static get(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore
                .collection(FirebaseDatastore_1.DatastoreCollection.DOC_META)
                .doc(id);
            const doc = yield ref.get(options);
            if (doc.exists) {
                return doc.data();
            }
            return undefined;
        });
    }
}
exports.DocPermissions = DocPermissions;
//# sourceMappingURL=DocPermissions.js.map