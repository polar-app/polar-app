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
exports.ExtendedDeviceInfo = exports.StorageInfo = exports.useStorageEstimate = exports.DeviceInfo = void 0;
const React = __importStar(require("react"));
const Version_1 = require("polar-shared/src/util/Version");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const Devices_1 = require("polar-shared/src/util/Devices");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
exports.DeviceInfo = () => {
    const version = Version_1.Version.get();
    const device = Devices_1.Devices.get();
    const platform = Platforms_1.Platforms.toSymbol(Platforms_1.Platforms.get());
    const isElectron = AppRuntime_1.AppRuntime.isElectron();
    return (React.createElement("div", null,
        React.createElement("h2", null, "Device: "),
        React.createElement("div", null,
            React.createElement("b", null, "Version: "),
            " ",
            version),
        React.createElement("div", null,
            React.createElement("b", null, "Device: "),
            " ",
            device),
        React.createElement("div", null,
            React.createElement("b", null, "Platform: "),
            " ",
            platform),
        React.createElement("div", null,
            React.createElement("b", null, "Electron: "),
            " ",
            '' + isElectron),
        React.createElement("div", null,
            React.createElement("b", null, "Screen width: "),
            " ",
            window.screen.width),
        React.createElement("div", null,
            React.createElement("b", null, "Screen height: "),
            " ",
            window.screen.height),
        React.createElement("div", null,
            React.createElement("b", null, "Device pixel ratio: "),
            " ",
            window.devicePixelRatio)));
};
const Fmt = (props) => {
    if (!props.children) {
        return null;
    }
    return (React.createElement("span", null, Number(props.children).toLocaleString()));
};
function useStorageEstimate() {
    const [storageEstimate, setStorageEstimate] = React.useState();
    if (navigator && navigator.storage) {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const estimate = yield navigator.storage.estimate();
                if (!storageEstimate) {
                    setStorageEstimate(estimate);
                }
            });
        }
        doAsync()
            .catch(err => console.error(err));
    }
    return storageEstimate;
}
exports.useStorageEstimate = useStorageEstimate;
exports.StorageInfo = () => {
    const storageEstimate = useStorageEstimate();
    if (storageEstimate) {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Storage:"),
            React.createElement("div", null,
                React.createElement("b", null, "quota: "),
                " ",
                React.createElement(Fmt, null, storageEstimate.quota)),
            React.createElement("div", null,
                React.createElement("b", null, "usage: "),
                " ",
                React.createElement(Fmt, null, storageEstimate.usage))));
    }
    else {
        return null;
    }
};
exports.ExtendedDeviceInfo = () => (React.createElement("div", null,
    React.createElement(exports.DeviceInfo, null),
    React.createElement(exports.StorageInfo, null),
    React.createElement("div", null,
        React.createElement("b", null, "User agent: "),
        React.createElement("div", null, navigator.userAgent))));
//# sourceMappingURL=DeviceInfo.js.map