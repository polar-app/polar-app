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
exports.DatastoreMutations = void 0;
const DatastoreMutation_1 = require("./DatastoreMutation");
class DatastoreMutations {
    constructor(consistency) {
        this.consistency = consistency;
    }
    static create(consistency) {
        return new DatastoreMutations(consistency);
    }
    performOrderedWrites(primarySync, secondarySync, primaryMutations, secondaryMutations, reject) {
        primarySync(primaryMutations)
            .then(() => {
        })
            .catch((err) => {
            reject(err);
        });
        Promise.all([primaryMutations.written.get(),
            primaryMutations.committed.get()])
            .then(() => {
            secondarySync(secondaryMutations)
                .catch(err => reject(err));
        })
            .catch((err) => {
            reject(err);
        });
    }
    executeBatchedWrite(datastoreMutation, remoteSync, localSync, remoteMutations = new DatastoreMutation_1.DefaultDatastoreMutation(), localMutations = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return __awaiter(this, void 0, void 0, function* () {
            const writeRemoteThenLocal = (reject) => {
                this.performOrderedWrites(remoteSync, localSync, remoteMutations, localMutations, reject);
            };
            const writeLocalThenRemote = (reject) => {
                this.performOrderedWrites(localSync, remoteSync, localMutations, remoteMutations, reject);
            };
            return new Promise((resolve, reject) => {
                writeLocalThenRemote(reject);
                this.batched(remoteMutations, localMutations, datastoreMutation);
                switch (this.consistency) {
                    case 'committed':
                        remoteMutations.committed.get()
                            .then(() => resolve())
                            .catch((err) => reject(err));
                        break;
                    case 'written':
                        localMutations.written.get()
                            .then(() => resolve())
                            .catch((err) => reject(err));
                        break;
                }
            });
        });
    }
    batched(remoteMutations, localMutations, target) {
        this.batchPromises(remoteMutations.written.get(), localMutations.written.get(), target.written, 'written');
        this.batchPromises(remoteMutations.committed.get(), localMutations.committed.get(), target.committed, 'committed');
    }
    batchPromises(remotePromise, localPromise, latch, consistency) {
        const batch = Promise.all([remotePromise, localPromise]);
        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });
    }
    static handle(delegate, target, converter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield delegate();
                const converted = converter(result);
                target.written.resolve(converted);
                target.committed.resolve(converted);
                return result;
            }
            catch (e) {
                target.written.reject(e);
                target.committed.reject(e);
                throw e;
            }
        });
    }
    static pipe(source, target, converter) {
        this.pipeLatch(source.written, target.written, converter, target.id);
        this.pipeLatch(source.committed, target.committed, converter, target.id);
    }
    static pipeLatch(source, target, converter, targetID) {
        source.get()
            .then((value) => {
            target.resolve(converter(value));
        })
            .catch(err => {
            target.reject(err);
        });
    }
}
exports.DatastoreMutations = DatastoreMutations;
//# sourceMappingURL=DatastoreMutations.js.map