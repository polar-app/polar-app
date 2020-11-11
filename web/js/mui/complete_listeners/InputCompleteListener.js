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
exports.InputCompleteListener = exports.useInputCompleteListener = exports.isInputCompleteEvent = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
const Providers_1 = require("polar-shared/src/util/Providers");
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const Platforms_1 = require("polar-shared/src/util/Platforms");
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
    const completable = opts.completable || Providers_1.Providers.of(true);
    const onKeyDown = React.useCallback((event) => {
        if (!completable()) {
            return;
        }
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
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        window.addEventListener('keydown', onKeyDown, { capture: true });
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        window.removeEventListener('keydown', onKeyDown, { capture: true });
    });
}
exports.useInputCompleteListener = useInputCompleteListener;
const InputCompleteSuggestion = () => {
    const theme = useTheme_1.default();
    const platform = Platforms_1.Platforms.get();
    function computeShortcut() {
        if (platform === Platforms_1.Platform.MACOS) {
            return "command + enter";
        }
        else {
            return "control + enter";
        }
    }
    const shortcut = computeShortcut();
    return (React.createElement("div", { style: {
            textAlign: 'center',
            color: theme.palette.text.hint
        } },
        shortcut,
        " to complete input"));
};
exports.InputCompleteListener = ReactUtils_1.deepMemo((props) => {
    useInputCompleteListener(props);
    return (React.createElement(React.Fragment, null,
        props.children,
        !props.noHint && React.createElement(InputCompleteSuggestion, null)));
});
//# sourceMappingURL=InputCompleteListener.js.map