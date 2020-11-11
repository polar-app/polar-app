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
exports.FirestoreCollections = void 0;
const Firestore_1 = require("../../../../web/js/firebase/Firestore");
const SpacedReps_1 = require("polar-firebase/src/firebase/om/SpacedReps");
const SpacedRepStats_1 = require("polar-firebase/src/firebase/om/SpacedRepStats");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const DocPreviews_1 = require("polar-firebase/src/firebase/om/DocPreviews");
const Heartbeats_1 = require("polar-firebase/src/firebase/om/Heartbeats");
class FirestoreCollections {
    static configure(firestore) {
        return __awaiter(this, void 0, void 0, function* () {
            firestore = firestore || (yield Firestore_1.Firestore.getInstance());
            for (const firestoreBacked of [SpacedReps_1.SpacedReps, SpacedRepStats_1.SpacedRepStats, DocPreviews_1.DocPreviews, Heartbeats_1.Heartbeats]) {
                if (Preconditions_1.isPresent(firestoreBacked.firestoreProvider)) {
                    continue;
                }
                firestoreBacked.firestoreProvider = () => firestore;
            }
        });
    }
}
exports.FirestoreCollections = FirestoreCollections;
//# sourceMappingURL=FirestoreCollections.js.map