"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudConnectivityButton = exports.useOnline = void 0;
const react_1 = __importDefault(require("react"));
const ReactLifecycleHooks_1 = require("../../../hooks/ReactLifecycleHooks");
const CloudOffline_1 = require("./CloudOffline");
function useOnline() {
    const [online, setOnline] = react_1.default.useState(navigator.onLine);
    const onConnectivityChange = react_1.default.useCallback(() => {
        setOnline(navigator.onLine);
    }, []);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        window.addEventListener('online', onConnectivityChange);
        window.addEventListener('offline', onConnectivityChange);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        window.removeEventListener('online', onConnectivityChange);
        window.removeEventListener('offline', onConnectivityChange);
    });
    return online;
}
exports.useOnline = useOnline;
exports.CloudConnectivityButton = react_1.default.memo(() => {
    const online = useOnline();
    if (!online) {
        return (react_1.default.createElement(CloudOffline_1.CloudOffline, null));
    }
    return null;
});
//# sourceMappingURL=CloudConnectivityButton.js.map