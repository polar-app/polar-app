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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoMigrationForBrowser = void 0;
const React = __importStar(require("react"));
const PrefsHook_1 = require("../../persistence_layer/PrefsHook");
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
const TwoMigrationForAppRuntime_1 = require("./TwoMigrationForAppRuntime");
const KEY = 'two-migration';
function useMigration() {
    const prefs = PrefsHook_1.usePrefs();
    const persistentPrefs = prefs.value;
    if (persistentPrefs) {
        const doMigration = !(persistentPrefs.isMarked(KEY) || LocalPrefs_1.LocalPrefs.isMarked(KEY));
        const onClose = () => __awaiter(this, void 0, void 0, function* () {
            LocalPrefs_1.LocalPrefs.mark(KEY);
            persistentPrefs.mark(KEY);
            yield persistentPrefs.commit();
        });
        return [doMigration, onClose];
    }
    if (prefs.error) {
        console.error("Could not useMigration: ", prefs.error);
        throw prefs.error;
    }
    const onClose = () => __awaiter(this, void 0, void 0, function* () {
        throw new Error("Not ready");
    });
    return [undefined, onClose];
}
exports.TwoMigrationForBrowser = React.memo((props) => {
    const [doMigration, onClose] = useMigration();
    if (doMigration === undefined) {
        return null;
    }
    if (!doMigration) {
        return props.children;
    }
    return (React.createElement(TwoMigrationForAppRuntime_1.TwoMigrationForAppRuntime, { runtime: "browser", onClose: onClose }, props.children));
});
//# sourceMappingURL=TwoMigrationForBrowser.js.map