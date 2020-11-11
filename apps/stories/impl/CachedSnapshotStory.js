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
exports.CachedSnapshotStory = void 0;
const React = __importStar(require("react"));
const MockSnapshots_1 = require("../../repository/js/persistence_layer/MockSnapshots");
const CachedSnapshotSubscriberContext_1 = require("../../../web/js/snapshots/CachedSnapshotSubscriberContext");
const MUIDialogControllers_1 = require("../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const [CacheStoryProvider, useCachedSnapshot] = CachedSnapshotSubscriberContext_1.createCachedSnapshotSubscriberContext();
const Inner = () => {
    const snapshot = useCachedSnapshot();
    return (React.createElement("div", null,
        "source: ",
        snapshot.source,
        " ",
        React.createElement("br", null),
        "exists: ",
        snapshot.exists ? 'true' : 'false',
        " ",
        React.createElement("br", null),
        "value: ",
        snapshot.value,
        " ",
        React.createElement("br", null)));
};
exports.CachedSnapshotStory = () => {
    const snapshotSubscriber = MockSnapshots_1.createMockSnapshotSubscriber();
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const onError = () => {
        dialogs.confirm({
            type: 'error',
            title: 'something bad',
            subtitle: 'some bad stuff',
            onAccept: Functions_1.NULL_FUNCTION
        });
    };
    return (React.createElement(CacheStoryProvider, { id: 'story', snapshotSubscriber: snapshotSubscriber, onError: onError },
        React.createElement(Inner, null)));
};
//# sourceMappingURL=CachedSnapshotStory.js.map