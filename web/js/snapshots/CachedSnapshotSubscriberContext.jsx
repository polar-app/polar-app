"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedSnapshotSubscriberContext = void 0;
var React = require("react");
var rxjs_1 = require("rxjs");
var ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
var CachedSnapshotSubscriber_1 = require("../../../../web/js/react/CachedSnapshotSubscriber");
/**
 * The underlying value 'V' can be undefined in which case 'exists' will be false.
 *
 * Note that if the user defines V as something like string | undefined the value
 * itself could be set to undefined in the database but then exists would be true.
 *
 * However, we do not call render 'children' until we have the first snapshot.
 */
function createCachedSnapshotSubscriberContext() {
    var subject = new rxjs_1.Subject();
    var initialContext = {
        subject: subject,
        current: undefined
    };
    var context = React.createContext(initialContext);
    /**
     * This component gets the context, then starts listening to it and
     * unsubscribes on component unmount.
     */
    var useSnapshot = function () {
        var storeContext = React.useContext(context);
        var _a = React.useState(storeContext.current), value = _a[0], setValue = _a[1];
        var subscriptionRef = React.useRef(storeContext.subject.subscribe(setValue));
        ReactLifecycleHooks_1.useComponentWillUnmount(function () {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        });
        // the value can never be undefined as we're only returning once we have
        // the first value
        return value;
    };
    var Provider = React.memo(function (props) {
        var storeContext = React.useContext(context);
        var onNext = React.useCallback(function (snapshot) {
            storeContext.current = snapshot;
            storeContext.subject.next(snapshot);
        }, [storeContext]);
        CachedSnapshotSubscriber_1.useLocalCachedSnapshotSubscriber({
            id: props.id,
            subscriber: props.snapshotSubscriber,
            onNext: onNext,
            onError: props.onError
        });
        return (<context.Provider value={initialContext}>
                {props.children}
            </context.Provider>);
    });
    return [Provider, useSnapshot];
}
exports.createCachedSnapshotSubscriberContext = createCachedSnapshotSubscriberContext;
