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
exports.GroupDocs = void 0;
const Collections_1 = require("./Collections");
class GroupDocs {
    static list(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Collections_1.Collections.list(this.COLLECTION, [['groupID', '==', groupID]]);
        });
    }
    static getByFingerprint(groupID, fingerprint, limit = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const clauses = [
                ['groupID', '==', groupID],
                ['fingerprint', '==', fingerprint]
            ];
            const orderBy = [
                ['created', 'desc']
            ];
            return yield Collections_1.Collections.list(this.COLLECTION, clauses, { orderBy, limit });
        });
    }
    static onSnapshot(groupID, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Collections_1.Collections.onQuerySnapshotChanges(this.COLLECTION, [['groupID', '==', groupID]], handler);
        });
    }
    static onSnapshotForByGroupIDAndFingerprint(groupID, fingerprint, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const clauses = [
                ['groupID', '==', groupID],
                ['fingerprint', '==', fingerprint],
            ];
            return yield Collections_1.Collections.onQuerySnapshotChanges(this.COLLECTION, clauses, handler);
        });
    }
}
exports.GroupDocs = GroupDocs;
GroupDocs.COLLECTION = 'group_doc';
//# sourceMappingURL=GroupDocs.js.map