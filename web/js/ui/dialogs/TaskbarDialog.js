"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskbarDialog = void 0;
const react_1 = __importDefault(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const Snackbar_1 = __importDefault(require("@material-ui/core/Snackbar"));
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const ReactUtils_1 = require("../../react/ReactUtils");
const Close_1 = __importDefault(require("@material-ui/icons/Close"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const ReactHooks_1 = require("../../hooks/ReactHooks");
const CircularProgressWithLabel_1 = require("../../mui/CircularProgressWithLabel");
const ConfirmDialog_1 = require("./ConfirmDialog");
exports.TaskbarDialog = ReactUtils_1.deepMemo((props) => {
    const [progress, setProgress, progressRef] = ReactHooks_1.useRefState({ value: 0, message: props.message });
    const [open, setOpen] = react_1.default.useState(true);
    const [cancelRequested, setCancelRequested] = react_1.default.useState(false);
    const handleCancel = react_1.default.useCallback(() => {
        setCancelRequested(true);
    }, []);
    const doCancel = react_1.default.useCallback(() => {
        setCancelRequested(false);
        if (props.onCancel) {
            props.onCancel();
        }
    }, [props]);
    function setProgressCallback(updateProgress) {
        function doTerminate() {
            setTimeout(() => setOpen(false), props.completedDuration || 1000);
        }
        if (updateProgress === 'terminate') {
            doTerminate();
            return;
        }
        if (!props.noAutoTerminate && updateProgress.value === 100) {
            doTerminate();
            return;
        }
        const newProgress = Object.assign(Object.assign({}, updateProgress), { message: updateProgress.message ? updateProgress.message : progressRef.current.message });
        setProgress(newProgress);
    }
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        props.onProgressCallback(setProgressCallback);
    });
    const Progress = () => {
        if (progress.value === 'indeterminate' || progress.value === 0) {
            return react_1.default.createElement(CircularProgress_1.default, { variant: "indeterminate" });
        }
        else {
            return react_1.default.createElement(CircularProgressWithLabel_1.CircularProgressWithLabel, { variant: "static", value: progress.value });
        }
    };
    const Action = () => {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Progress, null),
            props.onCancel && (react_1.default.createElement(IconButton_1.default, { color: "inherit", onClick: handleCancel },
                react_1.default.createElement(Close_1.default, null))),
            cancelRequested && (react_1.default.createElement(ConfirmDialog_1.ConfirmDialog, { title: "Are you sure you wish to cancel?", subtitle: "This will cancel all pending tasks", type: "danger", onAccept: doCancel }))));
    };
    return (react_1.default.createElement(Snackbar_1.default, { anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        }, open: open, autoHideDuration: props.autoHideDuration || 5000, onClose: Functions_1.NULL_FUNCTION, message: progress.message, action: react_1.default.createElement(Action, null) }));
});
//# sourceMappingURL=TaskbarDialog.js.map