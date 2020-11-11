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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefsContext = exports.usePrefsContext = exports.PrefsContextProvider = void 0;
const CachedSnapshotSubscriberContext_1 = require("../../../../web/js/snapshots/CachedSnapshotSubscriberContext");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const React = __importStar(require("react"));
const PrefsHook_1 = require("./PrefsHook");
const Functions_1 = require("polar-shared/src/util/Functions");
const Snapshots_1 = require("polar-shared/src/util/Snapshots");
_a = CachedSnapshotSubscriberContext_1.createCachedSnapshotSubscriberContext(), exports.PrefsContextProvider = _a[0], exports.usePrefsContext = _a[1];
exports.PrefsContext = React.memo((props) => {
    const snapshotSubscriberFactory = PrefsHook_1.usePrefsSnapshotSubscriberFactory();
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const converter = React.useCallback((from) => {
        if (from === undefined) {
            return undefined;
        }
        else {
            return {
                value: from,
                exists: true,
                source: 'server'
            };
        }
    }, []);
    const convertedSnapshotSubscriber = React.useMemo(() => {
        const snapshotSubscriber = snapshotSubscriberFactory();
        return Snapshots_1.SnapshotSubscribers.converted(snapshotSubscriber, converter);
    }, [converter, snapshotSubscriberFactory]);
    const onError = () => {
        dialogs.confirm({
            type: 'error',
            title: 'Unable to load prefs',
            subtitle: 'We were unable to load prefs. Please restart.',
            onAccept: Functions_1.NULL_FUNCTION
        });
    };
    return (React.createElement(exports.PrefsContextProvider, { id: 'story', snapshotSubscriber: convertedSnapshotSubscriber, onError: onError, filter: value => {
            return value !== undefined;
        } }, props.children));
});
//# sourceMappingURL=PrefsContext.js.map