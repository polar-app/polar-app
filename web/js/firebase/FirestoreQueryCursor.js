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
exports.DefaultFirestoreQueryCursorOptions = exports.FirestoreQueryCursor = void 0;
const Firestore_1 = require("./Firestore");
const Objects_1 = require("polar-shared/src/util/Objects");
class FirestoreQueryCursor {
    constructor(collection, whereClause, options = new DefaultFirestoreQueryCursorOptions()) {
        this.collection = collection;
        this.whereClause = whereClause;
        this.options = Objects_1.Objects.defaults(options, new DefaultFirestoreQueryCursorOptions());
    }
    hasNext() {
        return this.querySnapshot === undefined || this.querySnapshot.size >= this.options.limit;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("=========================");
            const firestore = yield Firestore_1.Firestore.getInstance();
            let query;
            if (this.querySnapshot === undefined) {
                query = firestore
                    .collection(this.collection)
                    .where(this.whereClause.fieldPath, this.whereClause.opStr, this.whereClause.value)
                    .orderBy(this.options.orderBy)
                    .limit(this.options.limit);
            }
            else {
                query = firestore
                    .collection(this.collection)
                    .where(this.whereClause.fieldPath, this.whereClause.opStr, this.whereClause.value)
                    .orderBy(this.options.orderBy)
                    .startAfter(this.startAfter)
                    .limit(this.options.limit);
            }
            this.querySnapshot = yield query.get(this.options.getOptions);
            const len = this.querySnapshot.docs.length;
            if (len > 0) {
                const lastDoc = this.querySnapshot.docs[len - 1];
                this.startAfter = lastDoc.id;
            }
            return this.querySnapshot;
        });
    }
}
exports.FirestoreQueryCursor = FirestoreQueryCursor;
class DefaultFirestoreQueryCursorOptions {
    constructor() {
        this.limit = 100;
        this.orderBy = "id";
    }
}
exports.DefaultFirestoreQueryCursorOptions = DefaultFirestoreQueryCursorOptions;
//# sourceMappingURL=FirestoreQueryCursor.js.map