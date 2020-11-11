"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSnapshots = exports.useSnapshotSubscriber = exports.useSnapshotSubscriberUsingCallbacks = void 0;
const react_1 = __importDefault(require("react"));
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const Preconditions_1 = require("polar-shared/src/Preconditions");
function useSnapshotSubscriberUsingCallbacks(subscriber, onNext, onError) {
    const subscriberIDRef = react_1.default.useRef(subscriber.id);
    const unsubscriberRef = react_1.default.useRef(undefined);
    if (unsubscriberRef.current && subscriberIDRef.current !== subscriber.id) {
        unsubscriberRef.current();
        unsubscriberRef.current = undefined;
    }
    if (!unsubscriberRef.current) {
        const unsubscriber = subscriber.subscribe(onNext, onError);
        if (!Preconditions_1.isPresent(unsubscriber)) {
            console.warn("No unsubscriber");
        }
        unsubscriberRef.current = unsubscriber;
    }
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });
}
exports.useSnapshotSubscriberUsingCallbacks = useSnapshotSubscriberUsingCallbacks;
function useSnapshotSubscriber(subscriber) {
    const [state, setState] = react_1.default.useState({
        value: undefined,
        error: undefined
    });
    const created = react_1.default.useMemo(() => Date.now(), []);
    const hasRecordedInitialLatency = react_1.default.useRef(false);
    function onNext(value) {
        if (!hasRecordedInitialLatency.current) {
            const lag = Date.now() - created;
            if (lag > 100) {
                console.warn(`Snapshot subscriber has high latency: id=${subscriber.id}, lag=${lag}ms`);
            }
        }
        setState({ value, error: undefined });
    }
    function onError(error) {
        setState({ value: undefined, error });
    }
    useSnapshotSubscriberUsingCallbacks(subscriber, onNext, onError);
    return state;
}
exports.useSnapshotSubscriber = useSnapshotSubscriber;
function useSnapshots(subscriber) {
    const [state, setState] = react_1.default.useState([undefined, undefined]);
    const unsubscriberRef = react_1.default.useRef(undefined);
    function onNext(value) {
        setState([value, undefined]);
    }
    function onError(error) {
        setState([undefined, error]);
    }
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        unsubscriberRef.current = subscriber(onNext, onError);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        if (unsubscriberRef.current) {
            unsubscriberRef.current();
        }
    });
    return state;
}
exports.useSnapshots = useSnapshots;
//# sourceMappingURL=UseSnapshotSubscriber.js.map