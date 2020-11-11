"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchDatastoreMutation = exports.CommittedDatastoreMutation = exports.DefaultDatastoreMutation = void 0;
const Latch_1 = require("polar-shared/src/util/Latch");
class AbstractDatastoreMutation {
    constructor() {
        this.id = AbstractDatastoreMutation.SEQUENCE++;
    }
}
AbstractDatastoreMutation.SEQUENCE = 0;
class DefaultDatastoreMutation extends AbstractDatastoreMutation {
    constructor() {
        super();
        this.written = new Latch_1.Latch();
        this.committed = new Latch_1.Latch();
    }
}
exports.DefaultDatastoreMutation = DefaultDatastoreMutation;
class CommittedDatastoreMutation extends AbstractDatastoreMutation {
    constructor(value) {
        super();
        this.written = new Latch_1.Latch();
        this.committed = new Latch_1.Latch();
        this.written.resolve(value);
        this.committed.resolve(value);
    }
}
exports.CommittedDatastoreMutation = CommittedDatastoreMutation;
class BatchDatastoreMutation extends AbstractDatastoreMutation {
    constructor(dm0, dm1, target) {
        super();
        this.written = target.written;
        this.committed = target.committed;
        this.batched(dm0.written.get(), dm1.written.get(), this.written);
        this.batched(dm0.committed.get(), dm1.committed.get(), this.committed);
    }
    batched(promise0, promise1, latch) {
        const batch = Promise.all([promise0, promise1]);
        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });
    }
}
exports.BatchDatastoreMutation = BatchDatastoreMutation;
//# sourceMappingURL=DatastoreMutation.js.map