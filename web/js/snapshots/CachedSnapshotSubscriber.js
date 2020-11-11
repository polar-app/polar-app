"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalCachedSnapshotSubscriber = exports.createLocalCachedSnapshotSubscriber = exports.LocalCache = void 0;
const React = __importStar(require("react"));
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
var LocalCache;
(function (LocalCache) {
    function read(cacheKey) {
        const cacheValue = localStorage.getItem(cacheKey);
        if (cacheValue === null || cacheValue === undefined) {
            return undefined;
        }
        try {
            const value = JSON.parse(cacheValue);
            return {
                exists: true,
                value,
                source: 'cache'
            };
        }
        catch (e) {
            console.error(`Unable to parse JSON for cached subscriber ${cacheKey}: ` + cacheValue, e);
            return undefined;
        }
    }
    LocalCache.read = read;
    function write(cacheKey, snapshot) {
        if (snapshot === undefined) {
            localStorage.removeItem(cacheKey);
        }
        else {
            localStorage.setItem(cacheKey, JSON.stringify(snapshot.value));
        }
    }
    LocalCache.write = write;
    function createKey(id) {
        return 'cache:' + id;
    }
    LocalCache.createKey = createKey;
})(LocalCache = exports.LocalCache || (exports.LocalCache = {}));
function createLocalCachedSnapshotSubscriber(opts) {
    const cacheKey = LocalCache.createKey(opts.id);
    const initialValue = LocalCache.read(cacheKey);
    if (initialValue) {
        opts.onNext(initialValue);
    }
    const onNext = (snapshot) => {
        opts.onNext(snapshot);
        LocalCache.write(cacheKey, snapshot);
    };
    return opts.subscriber(onNext, opts.onError);
}
exports.createLocalCachedSnapshotSubscriber = createLocalCachedSnapshotSubscriber;
function useLocalCachedSnapshotSubscriber(opts) {
    const cacheKey = React.useMemo(() => LocalCache.createKey(opts.id), [opts.id]);
    const readCacheData = React.useCallback(() => {
        return LocalCache.read(cacheKey);
    }, [cacheKey]);
    const writeCacheData = React.useCallback((snapshot) => {
        LocalCache.write(cacheKey, snapshot);
    }, [cacheKey]);
    const initialValue = React.useMemo(readCacheData, [readCacheData]);
    opts.onNext(initialValue);
    const unsubscriberRef = React.useRef();
    const onNext = React.useCallback((snapshot) => {
        writeCacheData(snapshot);
        opts.onNext(snapshot);
    }, [opts, writeCacheData]);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        unsubscriberRef.current = opts.subscriber(onNext, opts.onError);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });
}
exports.useLocalCachedSnapshotSubscriber = useLocalCachedSnapshotSubscriber;
//# sourceMappingURL=CachedSnapshotSubscriber.js.map