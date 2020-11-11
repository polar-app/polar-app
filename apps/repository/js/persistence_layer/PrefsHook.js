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
exports.usePrefs = exports.usePrefsSnapshotSubscriberFactory = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const UseSnapshotSubscriber_1 = require("../../../../web/js/ui/data_loader/UseSnapshotSubscriber");
const PersistenceLayerApp_1 = require("./PersistenceLayerApp");
function usePrefsSnapshotSubscriberFactory() {
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
    return React.useCallback(() => {
        const persistenceLayer = persistenceLayerProvider();
        if (!persistenceLayer) {
            console.warn("No persistence layer");
            return () => Functions_1.NULL_FUNCTION;
        }
        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();
        if (!prefs) {
            throw new Error("No prefs found from datastore: " + datastore.id);
        }
        if (!prefs.subscribe || !prefs.get) {
            throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
        }
        return prefs.subscribe.bind(prefs);
    }, [persistenceLayerProvider]);
}
exports.usePrefsSnapshotSubscriberFactory = usePrefsSnapshotSubscriberFactory;
function usePrefs() {
    const snapshotSubscriber = usePrefsSnapshotSubscriberFactory();
    return UseSnapshotSubscriber_1.useSnapshotSubscriber({ id: 'prefs', subscribe: snapshotSubscriber() });
}
exports.usePrefs = usePrefs;
//# sourceMappingURL=PrefsHook.js.map