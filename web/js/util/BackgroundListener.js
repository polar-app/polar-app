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
exports.BackgroundListeners = void 0;
const Functions_1 = require("polar-shared/src/util/Functions");
class BackgroundListeners {
    static create(listenable) {
        let started = false;
        let value;
        let snapshotUnsubscriber = Functions_1.NULL_FUNCTION;
        return {
            start: () => __awaiter(this, void 0, void 0, function* () {
                if (started) {
                    return;
                }
                value = yield listenable.get();
                snapshotUnsubscriber = yield listenable.onSnapshot(currentValue => {
                    value = currentValue;
                });
                started = true;
            }),
            get: () => {
                if (!started) {
                    throw new Error("Not started");
                }
                return value;
            },
            stop: () => {
                if (!started) {
                    return;
                }
                snapshotUnsubscriber();
            }
        };
    }
}
exports.BackgroundListeners = BackgroundListeners;
//# sourceMappingURL=BackgroundListener.js.map