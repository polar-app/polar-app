"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncWithError = exports.useComponentWillUnmount = exports.useComponentDidMount = void 0;
const react_1 = require("react");
const MUIDialogControllers_1 = require("../mui/dialogs/MUIDialogControllers");
const react_async_1 = require("react-async");
const Functions_1 = require("polar-shared/src/util/Functions");
function useComponentDidMount(delegate) {
    react_1.useEffect(() => delegate(), []);
}
exports.useComponentDidMount = useComponentDidMount;
function useComponentWillUnmount(delegate) {
    react_1.useEffect(() => delegate, []);
}
exports.useComponentWillUnmount = useComponentWillUnmount;
function useAsyncWithError(opts) {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const { data, error } = react_async_1.useAsync(opts);
    if (error) {
        dialogs.confirm({
            title: "An error occurred.",
            subtitle: "We encountered an error: " + error.message,
            type: 'error',
            onAccept: Functions_1.NULL_FUNCTION,
        });
    }
    return data;
}
exports.useAsyncWithError = useAsyncWithError;
//# sourceMappingURL=ReactLifecycleHooks.js.map