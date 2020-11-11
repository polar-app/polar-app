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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSubscribers = void 0;
const React = __importStar(require("react"));
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const Alert_1 = __importDefault(require("@material-ui/lab/Alert"));
var DataSubscribers;
(function (DataSubscribers) {
    function useDataSubscriber(snapshotSubscriber) {
        const context = React.createContext(undefined);
        const useComponent = (props) => {
            const [data, setData] = React.useState(undefined);
            const [err, setError] = React.useState(undefined);
            const unsubscriber = React.useRef();
            ReactLifecycleHooks_1.useComponentDidMount(() => {
                const onNext = (value) => {
                    if (this.unmounted) {
                        console.warn("DataLoader was unmounted but received event");
                        return;
                    }
                    if (value) {
                        setData(value);
                    }
                    else {
                        setData(undefined);
                    }
                };
                const onError = (err) => {
                    setError(err);
                };
                unsubscriber.current = snapshotSubscriber(onNext, onError);
            });
            ReactLifecycleHooks_1.useComponentWillUnmount(() => {
                if (unsubscriber.current) {
                    unsubscriber.current();
                }
            });
            if (err) {
                return (React.createElement(Alert_1.default, { severity: "error" },
                    "Error: ",
                    this.state.data.err.message));
            }
            return (React.createElement(context.Provider, { value: data }, props.children));
        };
        return [useComponent, context];
    }
    DataSubscribers.useDataSubscriber = useDataSubscriber;
})(DataSubscribers = exports.DataSubscribers || (exports.DataSubscribers = {}));
//# sourceMappingURL=DataSubscribers.js.map