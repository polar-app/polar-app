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
exports.ReviewerStatistics = void 0;
const SpacedRepStats_1 = require("polar-firebase/src/firebase/om/SpacedRepStats");
const Firebase_1 = require("../../../../web/js/firebase/Firebase");
const FirestoreCollections_1 = require("./FirestoreCollections");
class ReviewerStatistics {
    static statistics(mode, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield FirestoreCollections_1.FirestoreCollections.configure();
            const uid = yield Firebase_1.Firebase.currentUserID();
            if (!uid) {
                return [];
            }
            const records = yield SpacedRepStats_1.SpacedRepStats.list(uid, mode, type);
            return records;
        });
    }
}
exports.ReviewerStatistics = ReviewerStatistics;
//# sourceMappingURL=ReviewerStatistics.js.map