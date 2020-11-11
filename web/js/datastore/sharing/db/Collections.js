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
exports.Collections = void 0;
const Firestore_1 = require("../../../firebase/Firestore");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class Collections {
    static getByID(collection, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(collection).doc(id);
            const doc = yield ref.get();
            return doc.data();
        });
    }
    static createRef(collection, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(collection).doc(id);
            return ref;
        });
    }
    static deleteByID(collection, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const records = yield provider();
            for (const record of records) {
                const doc = firestore.collection(collection).doc(record.id);
                yield doc.delete();
            }
        });
    }
    static getByFieldValue(collection, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.list(collection, [[field, '==', value]]);
            return this.first(collection, [field], results);
        });
    }
    static getByFieldValues(collection, clauses) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.list(collection, clauses);
            const fields = clauses.map(current => current[0]);
            return this.first(collection, fields, results);
        });
    }
    static first(collection, fields, results) {
        if (results.length === 0) {
            return undefined;
        }
        else if (results.length === 1) {
            return results[0];
        }
        else {
            throw new Error(`Too many records on collection ${collection} for fields ${fields} ` + results.length);
        }
    }
    static list(collection, clauses, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.createQuery(collection, clauses, opts);
            const snapshot = yield query.get();
            return snapshot.docs.map(current => current.data());
        });
    }
    static onQuerySnapshotChanges(collection, clauses, delegate, errHandler = DefaultQuerySnapshotErrorHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.createQuery(collection, clauses);
            return query.onSnapshot(snapshot => {
                const changes = snapshot.docChanges().map(current => {
                    const type = current.type;
                    const value = current.doc.data();
                    return {
                        type,
                        value
                    };
                });
                delegate(changes);
            }, err => {
                errHandler(err, collection, clauses);
            });
        });
    }
    static onQuerySnapshot(collection, clauses, delegate, errHandler = DefaultQuerySnapshotErrorHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield this.createQuery(collection, clauses);
            return query.onSnapshot(snapshot => {
                delegate(snapshot.docs.map(current => current.data()));
            }, err => {
                errHandler(err, collection, clauses);
            });
        });
    }
    static onDocumentSnapshot(collection, id, delegate, errHandler = DefaultSnapshotErrorHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const ref = firestore.collection(collection).doc(id);
            return ref.onSnapshot(snapshot => {
                const toValue = () => {
                    if (snapshot.exists) {
                        return snapshot.data();
                    }
                    return undefined;
                };
                delegate(toValue());
            }, err => {
                errHandler(err, collection);
            });
        });
    }
    static createQuery(collection, clauses, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const clause = clauses[0];
            const [field, op, value] = clause;
            let query = firestore
                .collection(collection)
                .where(field, op, value);
            for (const clause of clauses.slice(1)) {
                const [field, op, value] = clause;
                query = query.where(field, op, value);
            }
            for (const orderBy of opts.orderBy || []) {
                query = query.orderBy(orderBy[0], orderBy[1]);
            }
            if (opts.limit) {
                query = query.limit(opts.limit);
            }
            return query;
        });
    }
}
exports.Collections = Collections;
const DefaultQuerySnapshotErrorHandler = (err, collection, clauses) => {
    log.error(`Unable to handle snapshot for collection ${collection}: `, clauses, err);
};
const DefaultSnapshotErrorHandler = (err, collection) => {
    log.error(`Unable to handle snapshot for collection ${collection}: `, err);
};
//# sourceMappingURL=Collections.js.map