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
exports.MockStorageBackend = exports.StorageBackends = exports.LocalPrefs = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
class LocalPrefs {
    static mark(key, value = true) {
        if (value) {
            this.set(key, 'true');
        }
        else {
            this.set(key, 'false');
        }
    }
    static toggle(key, value = false) {
        this.mark(key, !this.isMarked(key, value));
    }
    static markOnceRequested(key) {
        const result = this.isMarked(key);
        this.mark(key);
        return result;
    }
    static markOnceExecuted(key, handler, otherwise) {
        return __awaiter(this, void 0, void 0, function* () {
            const marked = this.isMarked(key);
            if (marked) {
                if (otherwise) {
                    yield otherwise();
                }
                return;
            }
            yield handler();
            this.mark(key);
        });
    }
    static isMarked(key, defaultValue = false) {
        const currentValue = this.get(key).getOrElse(`${defaultValue}`);
        return currentValue === 'true';
    }
    static isDelayed(key, duration) {
        const durationMS = TimeDurations_1.TimeDurations.toMillis(duration);
        const pref = this.get(key).getOrUndefined();
        if (pref && pref.match(/[0-9]+/)) {
            const until = parseInt(pref, 10);
            const now = Date.now();
            if (now < until) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    static computeDelay(key) {
        const pref = this.get(key).getOrUndefined();
        if (pref && pref.match(/[0-9]+/)) {
            const until = parseInt(pref, 10);
            const now = Date.now();
            return until - now;
        }
        else {
            return undefined;
        }
    }
    static markDelayed(key, duration) {
        const durationMS = TimeDurations_1.TimeDurations.toMillis(duration);
        const until = Date.now() + durationMS;
        this.set(key, `${until}`);
    }
    static defined(key) {
        return this.get(key).isPresent();
    }
    static get(key) {
        const storage = StorageBackends.get();
        return storage.get(key);
    }
    static set(key, value) {
        if (typeof value === 'number') {
            value = value.toString();
        }
        const storage = StorageBackends.get();
        storage.set(key, value);
    }
}
exports.LocalPrefs = LocalPrefs;
class StorageBackends {
    static get() {
        if (this.delegate) {
            return this.delegate;
        }
        return new LocalStorageBackend();
    }
}
exports.StorageBackends = StorageBackends;
class LocalStorageBackend {
    get(key) {
        return Optional_1.Optional.of(window.localStorage.getItem(key));
    }
    set(key, value) {
        window.localStorage.setItem(key, value);
    }
}
class MockStorageBackend {
    constructor() {
        this.backing = {};
    }
    get(key) {
        return Optional_1.Optional.of(this.backing[key]);
    }
    set(key, value) {
        this.backing[key] = value;
    }
}
exports.MockStorageBackend = MockStorageBackend;
//# sourceMappingURL=LocalPrefs.js.map