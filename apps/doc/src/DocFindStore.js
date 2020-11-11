"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocFindStore = exports.useDocFindMutator = exports.useDocFindCallbacks = exports.useDocFindStore = exports.DocFindStoreProviderDelegate = void 0;
const react_1 = __importDefault(require("react"));
const ObservableStore_1 = require("../../../web/js/react/store/ObservableStore");
const initialStore = {
    active: false,
    opts: {
        query: "",
        caseSensitive: false
    }
};
function mutatorFactory(storeProvider, setStore) {
    function reduce() {
        return undefined;
    }
    return {};
}
function callbacksFactory(storeProvider, setStore, mutator) {
    function setFinder(finder) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { finder }));
    }
    function setFindHandler(findHandler) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { findHandler }));
    }
    function setActive(active) {
        const store = storeProvider();
        if (active) {
            setStore(Object.assign(Object.assign({}, store), { active }));
        }
        else {
            if (store.findHandler) {
                store.findHandler.cancel();
            }
            setStore(Object.assign(Object.assign({}, store), { active, findHandler: undefined }));
        }
    }
    function doFind(opts) {
        const store = storeProvider();
        const { finder } = store;
        const doHandle = (opts) => {
            if (store.findHandler) {
                store.findHandler.cancel();
            }
            if (finder) {
                setStore(Object.assign(Object.assign({}, store), { matches: undefined, opts }));
                const findHandler = finder.exec(opts);
                setFindHandler(findHandler);
            }
            else {
                console.warn("No finder: ", finder);
            }
        };
        doHandle(opts);
    }
    function doFindNext() {
        const store = storeProvider();
        if (store.findHandler) {
            store.findHandler.next();
        }
    }
    function setMatches(matches) {
        const store = storeProvider();
        if (!store.active) {
            return;
        }
        setStore(Object.assign(Object.assign({}, store), { matches }));
    }
    function setOpts(opts) {
        const store = storeProvider();
        setStore(Object.assign(Object.assign({}, store), { opts }));
    }
    function reset(active = false) {
        const store = storeProvider();
        const findHandler = store.findHandler;
        setStore(Object.assign(Object.assign({}, store), { matches: undefined, opts: Object.assign(Object.assign({}, store.opts), { query: "" }), active, findHandler: undefined }));
        if (findHandler) {
            findHandler.cancel();
        }
    }
    return {
        setActive,
        setFinder,
        setFindHandler,
        doFind,
        setMatches,
        setOpts,
        reset,
        doFindNext
    };
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
}), exports.DocFindStoreProviderDelegate = _a[0], exports.useDocFindStore = _a[1], exports.useDocFindCallbacks = _a[2], exports.useDocFindMutator = _a[3];
exports.DocFindStore = react_1.default.memo((props) => {
    return (react_1.default.createElement(exports.DocFindStoreProviderDelegate, null, props.children));
});
//# sourceMappingURL=DocFindStore.js.map