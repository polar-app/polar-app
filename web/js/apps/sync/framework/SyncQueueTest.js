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
const chai_1 = require("chai");
const SyncQueue_1 = require("./SyncQueue");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
describe('SyncQueueTest', function () {
    const abortable = {
        aborted: false
    };
    const syncProgressListener = syncProgress => {
        console.log(syncProgress);
    };
    const syncQueue = new SyncQueue_1.SyncQueue(abortable, syncProgressListener);
    it("basic test", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
                results.push(0);
                return Optional_1.Optional.empty();
            }));
            yield syncQueue.execute();
            chai_1.assert.deepEqual(results, [0]);
        });
    });
    it("with one level of generators", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
                results.push(0);
                syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
                    results.push(1);
                    return Optional_1.Optional.empty();
                }));
                return Optional_1.Optional.empty();
            }));
            yield syncQueue.execute();
            chai_1.assert.deepEqual(results, [0, 1]);
        });
    });
});
//# sourceMappingURL=SyncQueueTest.js.map