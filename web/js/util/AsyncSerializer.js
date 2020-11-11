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
exports.AsyncSerializer = void 0;
const ArrayQueue_1 = require("./ArrayQueue");
const Latch_1 = require("polar-shared/src/util/Latch");
class AsyncSerializer {
    constructor() {
        this.blockers = new ArrayQueue_1.ArrayQueue();
    }
    execute(callable) {
        return __awaiter(this, void 0, void 0, function* () {
            const myBlocker = new Latch_1.Latch();
            try {
                const blocker = this.blockers.peek();
                if (blocker) {
                    yield blocker.get();
                }
                this.blockers.push(myBlocker);
                return yield callable();
            }
            finally {
                myBlocker.resolve(true);
                this.blockers.delete(myBlocker);
            }
        });
    }
}
exports.AsyncSerializer = AsyncSerializer;
//# sourceMappingURL=AsyncSerializer.js.map