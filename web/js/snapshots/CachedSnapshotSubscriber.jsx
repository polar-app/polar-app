"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalCachedSnapshotSubscriber = exports.createLocalCachedSnapshotSubscriber = exports.LocalCache = void 0;
var React = require("react");
var ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
var LocalCache;
(function (LocalCache) {
    function read(cacheKey) {
        var cacheValue = localStorage.getItem(cacheKey);
        if (cacheValue === null || cacheValue === undefined) {
            return undefined;
        }
        try {
            var value = JSON.parse(cacheValue);
            return {
                exists: true,
                value: value,
                source: 'cache'
            };
        }
        catch (e) {
            console.error("Unable to parse JSON for cached subscriber " + cacheKey + ": " + cacheValue, e);
            return undefined;
        }
    }
    LocalCache.read = read;
    function write(cacheKey, snapshot) {
        if (snapshot === undefined) {
            // TODO: I don't think this is correct and that we should write
            // undefined to the cache but this is a rare use case.
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
/**
 * Cached snapshot provider that uses write through and then reads future cached
 * values from cache.
 */
function createLocalCachedSnapshotSubscriber(opts) {
    var cacheKey = LocalCache.createKey(opts.id);
    var initialValue = LocalCache.read(cacheKey);
    if (initialValue) {
        opts.onNext(initialValue);
    }
    var onNext = function (snapshot) {
        opts.onNext(snapshot);
        LocalCache.write(cacheKey, snapshot);
    };
    return opts.subscriber(onNext, opts.onError);
}
exports.createLocalCachedSnapshotSubscriber = createLocalCachedSnapshotSubscriber;
function useLocalCachedSnapshotSubscriber(opts) {
    var cacheKey = React.useMemo(function () { return LocalCache.createKey(opts.id); }, [opts.id]);
    var readCacheData = React.useCallback(function () {
        return LocalCache.read(cacheKey);
    }, [cacheKey]);
    var writeCacheData = React.useCallback(function (snapshot) {
        LocalCache.write(cacheKey, snapshot);
    }, [cacheKey]);
    var initialValue = React.useMemo(readCacheData, [readCacheData]);
    // const [value, setValue] = React.useState(initialValue);
    opts.onNext(initialValue);
    var unsubscriberRef = React.useRef();
    var onNext = React.useCallback(function (snapshot) {
        writeCacheData(snapshot);
        opts.onNext(snapshot);
    }, [opts, writeCacheData]);
    ReactLifecycleHooks_1.useComponentDidMount(function () {
        unsubscriberRef.current = opts.subscriber(onNext, opts.onError);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(function () {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });
}
exports.useLocalCachedSnapshotSubscriber = useLocalCachedSnapshotSubscriber;
