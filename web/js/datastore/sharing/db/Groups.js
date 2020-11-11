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
exports.Groups = void 0;
const Firestore_1 = require("../../../firebase/Firestore");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Collections_1 = require("./Collections");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const HASHCODE_LEN = 20;
class Groups {
    static createIDForKey(uid, key) {
        return Hashcodes_1.Hashcodes.createID({ key, uid }, HASHCODE_LEN);
    }
    static get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(this.COLLECTION).doc(id);
            const doc = yield ref.get();
            return doc.data();
        });
    }
    static getAll(identifiers) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = identifiers.map(id => this.get(id));
            const resolved = yield Promise.all(promises);
            return Arrays_1.Arrays.onlyDefined(resolved);
        });
    }
    static getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const clauses = [
                ['visibility', '==', 'public'],
                ['name', '==', name]
            ];
            return Collections_1.Collections.getByFieldValues(this.COLLECTION, clauses);
        });
    }
    static executeSearchWithTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const visibilityClauses = [
                ['visibility', '==', 'public']
            ];
            const tagClauses = tags.map(current => ['tags', 'array-contains', current]);
            const clauses = [...visibilityClauses, ...tagClauses];
            const orderBy = [
                ['nrMembers', 'desc']
            ];
            const limit = 50;
            return yield Collections_1.Collections.list(this.COLLECTION, clauses, { orderBy, limit });
        });
    }
    static topGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const visibilityClauses = [
                ['visibility', '==', 'public']
            ];
            const clauses = [...visibilityClauses];
            const orderBy = [
                ['nrMembers', 'desc'],
                ['name', 'asc']
            ];
            const limit = 50;
            return yield Collections_1.Collections.list(this.COLLECTION, clauses, { orderBy, limit });
        });
    }
}
exports.Groups = Groups;
Groups.COLLECTION = 'group';
//# sourceMappingURL=Groups.js.map