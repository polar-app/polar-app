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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeExtensionInstallButton = exports.useWebExtensionInstalledSnapshots = exports.useWebExtensionInstalled = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../web/js/react/ReactUtils");
const Analytics_1 = require("../../../web/js/analytics/Analytics");
const LinkLoaderHook_1 = require("../../../web/js/ui/util/LinkLoaderHook");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const Browsers_1 = require("polar-browsers/src/Browsers");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const MUIFontAwesome_1 = require("../../../web/js/mui/MUIFontAwesome");
const UseSnapshotSubscriber_1 = require("../../../web/js/ui/data_loader/UseSnapshotSubscriber");
const WebExtensionPresenceClient_1 = require("polar-web-extension-api/src/WebExtensionPresenceClient");
const ReactLifecycleHooks_1 = require("../../../web/js/hooks/ReactLifecycleHooks");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ChromeStoreURLs_1 = require("polar-web-extension-api/src/ChromeStoreURLs");
const MUITooltip_1 = require("../../../web/js/mui/MUITooltip");
function useWebExtensionInstalled() {
    const [installed, setInstalled] = React.useState(undefined);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield WebExtensionPresenceClient_1.WebExtensionPresenceClient.exec();
                setInstalled(Preconditions_1.isPresent(response));
            });
        }
        doAsync()
            .catch(err => console.error(err));
    });
    return installed;
}
exports.useWebExtensionInstalled = useWebExtensionInstalled;
function useWebExtensionInstalledSnapshots() {
    const [installed, setInstalled] = React.useState(undefined);
    const subscriber = React.useMemo(() => ({
        id: 'web-extension-presence',
        subscribe: WebExtensionPresenceClient_1.WebExtensionPresenceClient.subscribe
    }), []);
    const { value, error } = UseSnapshotSubscriber_1.useSnapshotSubscriber(subscriber);
    if (error) {
        setInstalled(false);
        return;
    }
    if (value) {
        setInstalled(true);
    }
    else {
        setInstalled(false);
    }
    return installed;
}
exports.useWebExtensionInstalledSnapshots = useWebExtensionInstalledSnapshots;
exports.ChromeExtensionInstallButton = ReactUtils_1.deepMemo(() => {
    var _a;
    const isChrome = ['chrome', 'chromium'].includes(((_a = Browsers_1.Browsers.get()) === null || _a === void 0 ? void 0 : _a.id) || '');
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    const webExtensionInstalled = useWebExtensionInstalled();
    function onClick() {
        Analytics_1.Analytics.event({ category: 'chrome-extension', action: 'manual-installation-triggered' });
        const chromeStoreURL = ChromeStoreURLs_1.ChromeStoreURLs.create();
        linkLoader(chromeStoreURL, { newWindow: true, focus: true });
    }
    if (!isChrome) {
        return null;
    }
    if (AppRuntime_1.AppRuntime.isElectron()) {
        return null;
    }
    if (webExtensionInstalled === true) {
        return null;
    }
    if (webExtensionInstalled === undefined) {
        return null;
    }
    return (React.createElement(MUITooltip_1.MUITooltip, { title: "Install our web extension to enable all features including web capture." },
        React.createElement(Button_1.default, { onClick: () => onClick(), variant: "contained", startIcon: React.createElement(MUIFontAwesome_1.FAChromeIcon, null), size: "medium", color: "default" }, "Install Chrome Extension")));
});
//# sourceMappingURL=ChromeExtensionInstallButton.js.map