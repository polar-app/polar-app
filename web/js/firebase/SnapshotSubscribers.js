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
exports.SnapshotSubscribers = void 0;
const Functions_1 = require("polar-shared/src/util/Functions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class SnapshotSubscribers {
    static createFromAsyncProvider(provider) {
        return (onNext, onError) => {
            const handler = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield provider();
                    onNext(result);
                }
                catch (e) {
                    if (onError) {
                        onError(e);
                    }
                }
            });
            handler()
                .catch(err => log.error("Could not create snapshot subscriber: ", err));
            return Functions_1.NULL_FUNCTION;
        };
    }
}
exports.SnapshotSubscribers = SnapshotSubscribers;
//# sourceMappingURL=SnapshotSubscribers.js.map