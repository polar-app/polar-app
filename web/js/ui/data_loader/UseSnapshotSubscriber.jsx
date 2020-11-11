"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSnapshots = exports.useSnapshotSubscriber = exports.useSnapshotSubscriberUsingCallbacks = void 0;
var react_1 = require("react");
var ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
var Preconditions_1 = require("polar-shared/src/Preconditions");
function useSnapshotSubscriberUsingCallbacks(subscriber, onNext, onError) {
    var subscriberIDRef = react_1.default.useRef(subscriber.id);
    var unsubscriberRef = react_1.default.useRef(undefined);
    if (unsubscriberRef.current && subscriberIDRef.current !== subscriber.id) {
        // we've been called again but there's an existing unsubscriber so
        // we have to unsubscribe, then resubscribe.
        unsubscriberRef.current();
        unsubscriberRef.current = undefined;
    }
    if (!unsubscriberRef.current) {
        var unsubscriber = subscriber.subscribe(onNext, onError);
        if (!Preconditions_1.isPresent(unsubscriber)) {
            console.warn("No unsubscriber");
        }
        unsubscriberRef.current = unsubscriber;
    }
    ReactLifecycleHooks_1.useComponentWillUnmount(function () {
        if (unsubscriberRef.current) {
            // we're unmounting and we need to unsubscribe to snapshots
            unsubscriberRef.current();
        }
    });
}
exports.useSnapshotSubscriberUsingCallbacks = useSnapshotSubscriberUsingCallbacks;
// TODO: I don't know if I like this because the subscription returns undefined
// if the remote value is removed but we don't have a dedicated type so we're
// unable to determine if the value was DELETED or just pending a read.
/**
 * @NotStale I might end up using this in the future.
 */
function useSnapshotSubscriber(subscriber) {
    var _a = react_1.default.useState({
        value: undefined,
        error: undefined
    }), state = _a[0], setState = _a[1];
    var created = react_1.default.useMemo(function () { return Date.now(); }, []);
    var hasRecordedInitialLatency = react_1.default.useRef(false);
    function onNext(value) {
        if (!hasRecordedInitialLatency.current) {
            var lag = Date.now() - created;
            if (lag > 100) {
                console.warn("Snapshot subscriber has high latency: id=" + subscriber.id + ", lag=" + lag + "ms");
            }
        }
        setState({ value: value, error: undefined });
    }
    function onError(error) {
        setState({ value: undefined, error: error });
    }
    useSnapshotSubscriberUsingCallbacks(subscriber, onNext, onError);
    return state;
}
exports.useSnapshotSubscriber = useSnapshotSubscriber;
function useSnapshots(subscriber) {
    var _a = react_1.default.useState([undefined, undefined]), state = _a[0], setState = _a[1];
    var unsubscriberRef = react_1.default.useRef(undefined);
    function onNext(value) {
        setState([value, undefined]);
    }
    function onError(error) {
        setState([undefined, error]);
    }
    ReactLifecycleHooks_1.useComponentDidMount(function () {
        unsubscriberRef.current = subscriber(onNext, onError);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(function () {
        if (unsubscriberRef.current) {
            // we're unmounting and we need to unsubscribe to snapshots
            unsubscriberRef.current();
        }
    });
    return state;
}
exports.useSnapshots = useSnapshots;
