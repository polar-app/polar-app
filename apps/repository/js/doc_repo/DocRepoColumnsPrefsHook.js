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
exports.useDocRepoColumnsPrefsMutator = exports.useDocRepoColumnsPrefs = void 0;
const React = __importStar(require("react"));
const PersistenceLayerApp_1 = require("../persistence_layer/PersistenceLayerApp");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const PREF_KEY = 'doc_repo_columns';
function useDocRepoColumnsPrefs() {
    const prefs = PersistenceLayerApp_1.usePrefsContext();
    const prefValue = prefs.fetch(PREF_KEY);
    if (prefValue) {
        try {
            return JSON.parse(prefValue.value);
        }
        catch (e) {
            console.error("Could not parse perf: ", e);
        }
    }
    return ['title', 'added', 'lastUpdated', 'tags', 'progress'];
}
exports.useDocRepoColumnsPrefs = useDocRepoColumnsPrefs;
function useDocRepoColumnsPrefsMutator() {
    const prefs = PersistenceLayerApp_1.usePrefsContext();
    const log = MUILogger_1.useLogger();
    return React.useCallback((columns) => {
        if (!prefs) {
            return;
        }
        prefs.set(PREF_KEY, JSON.stringify(columns));
        prefs.commit().catch(err => log.error(err));
    }, [log, prefs]);
}
exports.useDocRepoColumnsPrefsMutator = useDocRepoColumnsPrefsMutator;
//# sourceMappingURL=DocRepoColumnsPrefsHook.js.map