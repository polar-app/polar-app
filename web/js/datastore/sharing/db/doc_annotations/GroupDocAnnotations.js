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
exports.GroupDocAnnotations = void 0;
const Collections_1 = require("../Collections");
const Arrays_1 = require("polar-shared/src/util/Arrays");
class GroupDocAnnotations {
    static list(groupID) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderBy = [
                ['lastUpdated', 'desc']
            ];
            const limit = 50;
            const clauses = [['groupID', '==', groupID]];
            return yield Collections_1.Collections.list(this.COLLECTION, clauses, { limit, orderBy });
        });
    }
    static get(groupID, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 1;
            const clauses = [
                ['groupID', '==', groupID],
                ['id', '==', id]
            ];
            const results = yield Collections_1.Collections.list(this.COLLECTION, clauses, { limit });
            return Arrays_1.Arrays.first(results);
        });
    }
}
exports.GroupDocAnnotations = GroupDocAnnotations;
GroupDocAnnotations.COLLECTION = 'group_doc_annotation';
//# sourceMappingURL=GroupDocAnnotations.js.map