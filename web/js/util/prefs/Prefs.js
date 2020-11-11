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
exports.ListenablePersistentPrefs = exports.NonPersistentPrefs = exports.CompositePrefs = exports.DictionaryPrefs = exports.InterceptedPersistentPrefsFactory = exports.InterceptedPrefsProvider = exports.Prefs = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
class Prefs {
    mark(key, value = true) {
        if (value) {
            this.set(key, 'true');
        }
        else {
            this.set(key, 'false');
        }
    }
    toggleMarked(key, value = false) {
        this.mark(key, !this.isMarked(key, value));
    }
    isMarked(key, defaultValue = false) {
        Preconditions_1.Preconditions.assertPresent(key, "key");
        const currentValue = this.get(key).getOrElse(`${defaultValue}`);
        return currentValue === 'true';
    }
    markDelayed(key, duration = "1w") {
        const durationMS = TimeDurations_1.TimeDurations.toMillis(duration);
        const after = Date.now() + durationMS;
        this.set(key, `${after}`);
    }
    isMarkedDelayed(key) {
        const val = this.get(key).getOrElse('');
        if (val.match(/[0-9]+/)) {
            return Date.now() < parseInt(val);
        }
        return false;
    }
    defined(key) {
        return this.get(key).isPresent();
    }
}
exports.Prefs = Prefs;
class InterceptedPrefsProvider {
    constructor(delegate, onCommit) {
        this.delegate = delegate;
        this.onCommit = onCommit;
    }
    get() {
        return this.intercept(this.delegate.get());
    }
    subscribe(onNext, onError) {
        const handleOnNext = (persistentPrefs) => {
            onNext(this.intercept(persistentPrefs));
        };
        return this.delegate.subscribe(handleOnNext, onError);
    }
    intercept(persistentPrefs) {
        if (persistentPrefs) {
            return InterceptedPersistentPrefsFactory.create(persistentPrefs, this.onCommit);
        }
        else {
            return undefined;
        }
    }
}
exports.InterceptedPrefsProvider = InterceptedPrefsProvider;
class InterceptedPersistentPrefsFactory {
    static create(persistentPrefs, onCommit) {
        const commit = () => __awaiter(this, void 0, void 0, function* () {
            yield onCommit(persistentPrefs);
            yield persistentPrefs.commit();
        });
        return Object.assign(Object.assign({}, persistentPrefs), { update: persistentPrefs.update, fetch: persistentPrefs.fetch, prefs: persistentPrefs.prefs, mark: persistentPrefs.mark, isMarkedDelayed: persistentPrefs.isMarkedDelayed, toggleMarked: persistentPrefs.toggleMarked, isMarked: persistentPrefs.isMarked, markDelayed: persistentPrefs.markDelayed, get: persistentPrefs.get, set: persistentPrefs.set, toDict: persistentPrefs.toDict, toPrefDict: persistentPrefs.toPrefDict, defined: persistentPrefs.defined, __intercepted: true, commit });
    }
}
exports.InterceptedPersistentPrefsFactory = InterceptedPersistentPrefsFactory;
class DictionaryPrefs extends Prefs {
    constructor(delegate = {}) {
        super();
        this.delegate = {};
        this.update(delegate);
    }
    update(dict = {}) {
        if (!dict) {
            return false;
        }
        const isInvalid = (pref) => {
            return typeof pref === 'string';
        };
        const needsUpdate = (curr, next) => {
            if (curr) {
                if (ISODateTimeStrings_1.ISODateTimeStrings.compare(curr.written, next.written) >= 0) {
                    return false;
                }
            }
            return true;
        };
        let updated = false;
        for (const pref of Object.values(dict)) {
            if (isInvalid(pref)) {
                continue;
            }
            const curr = this.fetch(pref.key);
            if (needsUpdate(curr, pref)) {
                this.delegate[pref.key] = pref;
                updated = true;
            }
        }
        return updated;
    }
    get(key) {
        const pref = this.delegate[key];
        if (pref) {
            return Optional_1.Optional.of(pref.value);
        }
        return Optional_1.Optional.empty();
    }
    set(key, value) {
        const written = ISODateTimeStrings_1.ISODateTimeStrings.create();
        this.delegate[key] = {
            key,
            value,
            written
        };
    }
    toDict() {
        const result = {};
        for (const current of Object.values(this.delegate)) {
            result[current.key] = current.value;
        }
        return result;
    }
    toPrefDict() {
        return Object.assign({}, this.delegate);
    }
    fetch(key) {
        return Optional_1.Optional.of(this.delegate[key]).getOrUndefined();
    }
    prefs() {
        return Object.values(this.delegate);
    }
}
exports.DictionaryPrefs = DictionaryPrefs;
class CompositePrefs {
    constructor(delegates) {
        this.delegate = Preconditions_1.Preconditions.assertPresent(delegates[0], 'delegate');
        this.delegates = delegates;
    }
    defined(key) {
        return this.delegate.defined(key);
    }
    get(key) {
        return this.delegate.get(key);
    }
    isMarked(key, defaultValue) {
        return this.delegate.isMarked(key, defaultValue);
    }
    isMarkedDelayed(key) {
        return this.delegate.isMarkedDelayed(key);
    }
    mark(key, value) {
        return this.delegate.mark(key, value);
    }
    markDelayed(key, duration) {
        return this.delegate.markDelayed(key, duration);
    }
    toDict() {
        return this.delegate.toDict();
    }
    toPrefDict() {
        return this.delegate.toPrefDict();
    }
    toggleMarked(key, value) {
        return this.toggleMarked(key, value);
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const delegate of this.delegates) {
                yield this.delegate.commit();
            }
        });
    }
    set(key, value) {
        for (const delegate of this.delegates) {
            this.delegate.set(key, value);
        }
    }
    fetch(key) {
        return this.delegate.fetch(key);
    }
    prefs() {
        return this.delegate.prefs();
    }
    update(dict) {
        return this.delegate.update(dict);
    }
}
exports.CompositePrefs = CompositePrefs;
class NonPersistentPrefs extends DictionaryPrefs {
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.NonPersistentPrefs = NonPersistentPrefs;
class ListenablePersistentPrefs extends CompositePrefs {
    constructor(backing, onUpdated) {
        super([backing]);
        this.backing = backing;
        this.onUpdated = onUpdated;
    }
    commit() {
        const _super = Object.create(null, {
            commit: { get: () => super.commit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.onUpdated(this);
            return _super.commit.call(this);
        });
    }
}
exports.ListenablePersistentPrefs = ListenablePersistentPrefs;
//# sourceMappingURL=Prefs.js.map