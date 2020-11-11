"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskbarDialog = void 0;
var react_1 = require("react");
var Functions_1 = require("polar-shared/src/util/Functions");
var ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
var Snackbar_1 = require("@material-ui/core/Snackbar");
var CircularProgress_1 = require("@material-ui/core/CircularProgress");
var ReactUtils_1 = require("../../react/ReactUtils");
var Close_1 = require("@material-ui/icons/Close");
var IconButton_1 = require("@material-ui/core/IconButton");
var ReactHooks_1 = require("../../hooks/ReactHooks");
var CircularProgressWithLabel_1 = require("../../mui/CircularProgressWithLabel");
var ConfirmDialog_1 = require("./ConfirmDialog");
/**
 * Like a Snackbar but it includes progress...
 */
exports.TaskbarDialog = ReactUtils_1.deepMemo(function (props) {
    var _a = ReactHooks_1.useRefState({ value: 0, message: props.message }), progress = _a[0], setProgress = _a[1], progressRef = _a[2];
    var _b = react_1.default.useState(true), open = _b[0], setOpen = _b[1];
    var _c = react_1.default.useState(false), cancelRequested = _c[0], setCancelRequested = _c[1];
    var handleCancel = react_1.default.useCallback(function () {
        setCancelRequested(true);
    }, []);
    var doCancel = react_1.default.useCallback(function () {
        setCancelRequested(false);
        if (props.onCancel) {
            props.onCancel();
        }
    }, [props]);
    function setProgressCallback(updateProgress) {
        function doTerminate() {
            setTimeout(function () { return setOpen(false); }, props.completedDuration || 1000);
        }
        if (updateProgress === 'terminate') {
            doTerminate();
            return;
        }
        if (!props.noAutoTerminate && updateProgress.value === 100) {
            // close the task but only after a delay so that the user sees that
            // it finished.
            doTerminate();
            return;
        }
        var newProgress = __assign(__assign({}, updateProgress), { message: updateProgress.message ? updateProgress.message : progressRef.current.message });
        setProgress(newProgress);
    }
    ReactLifecycleHooks_1.useComponentDidMount(function () {
        props.onProgressCallback(setProgressCallback);
    });
    var Progress = function () {
        if (progress.value === 'indeterminate' || progress.value === 0) {
            // TODO: don't show indeterminate when we are zero in the future when we can show a circular progress
            // with a background color
            return <CircularProgress_1.default variant="indeterminate"/>;
        }
        else {
            return <CircularProgressWithLabel_1.CircularProgressWithLabel variant="static" value={progress.value}/>;
        }
    };
    var Action = function () {
        return (<>
                <Progress />

                {props.onCancel && (<IconButton_1.default color="inherit" onClick={handleCancel}>
                        <Close_1.default />
                    </IconButton_1.default>)}

                {cancelRequested && (<ConfirmDialog_1.ConfirmDialog title="Are you sure you wish to cancel?" subtitle="This will cancel all pending tasks" type="danger" onAccept={doCancel}/>)}

            </>);
    };
    return (<Snackbar_1.default anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }} open={open} autoHideDuration={props.autoHideDuration || 5000} onClose={Functions_1.NULL_FUNCTION} message={progress.message} action={<Action />}/>);
});
