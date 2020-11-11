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
exports.SyncEntities = void 0;
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Collections_1 = require("../datastore/sharing/db/Collections");
const Firebase_1 = require("../firebase/Firebase");
const Firestore_1 = require("../firebase/Firestore");
var SyncEntities;
(function (SyncEntities) {
    const HASHCODE_LEN = 20;
    const COLLECTION = 'sync_entity';
    function createID(type, src) {
        return Hashcodes_1.Hashcodes.createID({ type, src }, HASHCODE_LEN);
    }
    SyncEntities.createID = createID;
    function listByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = yield Firebase_1.Firebase.currentUserID();
            const clauses = [
                ['type', '==', type],
                ['uid', '==', uid]
            ];
            return yield Collections_1.Collections.list(this.COLLECTION, clauses, {});
        });
    }
    SyncEntities.listByType = listByType;
    function get(type, src) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = createID(type, src);
            const uid = yield Firebase_1.Firebase.currentUserID();
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(COLLECTION).doc(id);
            const doc = yield ref.get();
            return doc.exists ? doc.data() : undefined;
        });
    }
    SyncEntities.get = get;
    function set(type, src, dest) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = createID(type, src);
            const uid = yield Firebase_1.Firebase.currentUserID();
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(COLLECTION).doc(id);
            yield ref.set({ id, uid, src, dest, type });
        });
    }
    SyncEntities.set = set;
})(SyncEntities = exports.SyncEntities || (exports.SyncEntities = {}));
//# sourceMappingURL=SyncEntities.js.map