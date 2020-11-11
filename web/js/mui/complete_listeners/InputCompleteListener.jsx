"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputCompleteListener = exports.useInputCompleteListener = exports.isInputCompleteEvent = void 0;
var React = require("react");
var ReactUtils_1 = require("../../react/ReactUtils");
var Providers_1 = require("polar-shared/src/util/Providers");
var ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
var useTheme_1 = require("@material-ui/core/styles/useTheme");
var Platforms_1 = require("polar-shared/src/util/Platforms");
function isInputCompleteEvent(type, event) {
    switch (type) {
        case "enter":
            return event.key === 'Enter';
        case "meta+enter":
            return (event.ctrlKey || event.metaKey) && event.key === 'Enter';
    }
}
exports.isInputCompleteEvent = isInputCompleteEvent;
function useInputCompleteListener(opts) {
    var completable = opts.completable || Providers_1.Providers.of(true);
    // TODO: I think this is technically wrong because we have to
    // listen and unmount the key listeners on both unmount but also
    // when dependencies change.
    var onKeyDown = React.useCallback(function (event) {
        if (!completable()) {
            return;
        }
        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly
        if (isInputCompleteEvent(opts.type, event)) {
            opts.onComplete();
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    }, [completable, opts]);
    ReactLifecycleHooks_1.useComponentDidMount(function () {
        window.addEventListener('keydown', onKeyDown, { capture: true });
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(function () {
        window.removeEventListener('keydown', onKeyDown, { capture: true });
    });
}
exports.useInputCompleteListener = useInputCompleteListener;
var InputCompleteSuggestion = function () {
    var theme = useTheme_1.default();
    var platform = Platforms_1.Platforms.get();
    // if ([Platform.MACOS, Platform.LINUX, Platform.WINDOWS].includes(platform)) {
    //     // only do this on desktop platforms
    //     return null;
    // }
    function computeShortcut() {
        if (platform === Platforms_1.Platform.MACOS) {
            return "command + enter";
        }
        else {
            return "control + enter";
        }
    }
    var shortcut = computeShortcut();
    return (<div style={{
        textAlign: 'center',
        color: theme.palette.text.hint
    }}>

            {shortcut} to complete input

        </div>);
};
exports.InputCompleteListener = ReactUtils_1.deepMemo(function (props) {
    useInputCompleteListener(props);
    return (<>
            {props.children}
            {!props.noHint && <InputCompleteSuggestion />}
        </>);
});
