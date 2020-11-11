"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserWindowRegistry = exports.DefaultLiveWindowsProvider = exports.BrowserWindowMeta = void 0;
const electron_1 = require("electron");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
class BrowserWindowMeta {
    constructor() {
        this.tags = {};
    }
}
exports.BrowserWindowMeta = BrowserWindowMeta;
class DefaultLiveWindowsProvider {
    getLiveWindowIDs() {
        return electron_1.BrowserWindow.getAllWindows().map(current => current.id);
    }
}
exports.DefaultLiveWindowsProvider = DefaultLiveWindowsProvider;
class BrowserWindowRegistry {
    static get(id) {
        this.gc();
        return this.registry[`${id}`];
    }
    static tag(id, tags) {
        this.gc();
        if (!(id in this.registry)) {
            this.registry[`${id}`] = new BrowserWindowMeta();
        }
        const meta = this.registry[`${id}`];
        Dictionaries_1.Dictionaries.forDict(tags, (name, value) => {
            meta.tags[name] = value;
        });
    }
    static tagged(tag) {
        this.gc();
        const result = [];
        Dictionaries_1.Dictionaries.forDict(this.registry, (id, meta) => {
            if (meta.tags[tag.name] === tag.value) {
                result.push(parseInt(id));
            }
        });
        return result;
    }
    static dump() {
        return Object.freeze(Object.assign({}, this.registry));
    }
    static gc() {
        const registryKeys = Object.keys(this.registry);
        const liveWindowIDs = this.liveWindowsProvider.getLiveWindowIDs().map(current => current.toString());
        const allWindowIDs = SetArrays_1.SetArrays.union(registryKeys, liveWindowIDs);
        const keysToRemove = SetArrays_1.SetArrays.difference(allWindowIDs, liveWindowIDs);
        keysToRemove.forEach(current => delete this.registry[current]);
        return keysToRemove.map(current => parseInt(current));
    }
}
exports.BrowserWindowRegistry = BrowserWindowRegistry;
BrowserWindowRegistry.registry = {};
BrowserWindowRegistry.liveWindowsProvider = new DefaultLiveWindowsProvider();
//# sourceMappingURL=BrowserWindowRegistry.js.map