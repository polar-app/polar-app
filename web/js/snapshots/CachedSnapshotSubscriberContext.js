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
exports.createCachedSnapshotSubscriberContext = void 0;
const React = __importStar(require("react"));
const rxjs_1 = require("rxjs");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
const CachedSnapshotSubscriber_1 = require("./CachedSnapshotSubscriber");
function createCachedSnapshotSubscriberContext() {
    const subject = new rxjs_1.Subject();
    const initialContext = {
        subject,
        current: undefined
    };
    const context = React.createContext(initialContext);
    const useSnapshot = () => {
        const storeContext = React.useContext(context);
        const [value, setValue] = React.useState(storeContext.current);
        const subscriptionRef = React.useRef(storeContext.subject.subscribe(setValue));
        ReactLifecycleHooks_1.useComponentWillUnmount(() => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        });
        return value;
    };
    const Provider = React.memo((props) => {
        const storeContext = React.useContext(context);
        const onNext = React.useCallback((snapshot) => {
            storeContext.current = snapshot;
            storeContext.subject.next(snapshot);
        }, [storeContext]);
        CachedSnapshotSubscriber_1.useLocalCachedSnapshotSubscriber({
            id: props.id,
            subscriber: props.snapshotSubscriber,
            onNext,
            onError: props.onError
        });
        return (React.createElement(context.Provider, { value: initialContext }, props.filter ? (props.filter(storeContext.current) && props.children) : props.children));
    });
    return [Provider, useSnapshot];
}
exports.createCachedSnapshotSubscriberContext = createCachedSnapshotSubscriberContext;
//# sourceMappingURL=CachedSnapshotSubscriberContext.js.map