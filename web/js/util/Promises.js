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
exports.Promises = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Functions_1 = require("polar-shared/src/util/Functions");
const Latch_1 = require("polar-shared/src/util/Latch");
const log = Logger_1.Logger.create();
class Promises {
    static any(p0, ...morePromises) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [p0, ...morePromises];
            const latch = new Latch_1.Latch();
            const errors = [];
            const onError = (err) => {
                errors.push(err);
                if (errors.length === promises.length) {
                    latch.reject(errors[0]);
                }
            };
            for (const promise of promises) {
                promise.then(value => latch.resolve(value))
                    .catch(err => onError(err));
            }
            return latch.get();
        });
    }
    static executeInBackground(promises, errorHandler) {
        for (const promise of promises) {
            promise.then(Functions_1.NULL_FUNCTION)
                .catch(err => errorHandler(err));
        }
    }
    static waitFor(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        });
    }
    static of(val) {
        return new Promise(resolve => {
            resolve(val);
        });
    }
    static withTimeout(timeout, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    callback().then(result => resolve(result))
                        .catch(err => reject(err));
                }, timeout);
            });
        });
    }
    static toVoidPromise(delegate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield delegate();
        });
    }
    static executeLogged(func) {
        func().catch(err => log.error("Caught error: ", err));
    }
    static requestAnimationFrame(callback = Functions_1.NULL_FUNCTION) {
        return new Promise(resolve => {
            callback();
            window.requestAnimationFrame(() => resolve());
        });
    }
    static toDelayed(delegate) {
        return () => {
            return new Promise((resolve, reject) => {
                try {
                    resolve(delegate());
                }
                catch (err) {
                    reject(err);
                }
            });
        };
    }
}
exports.Promises = Promises;
//# sourceMappingURL=Promises.js.map