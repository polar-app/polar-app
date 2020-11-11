"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeExtensionInstallation = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Analytics_1 = require("../../../web/js/analytics/Analytics");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const EXTENSION_URL = "https://chrome.google.com/webstore/detail/jkfdkjomocoaljglgddnmhcbolldcafd";
class ChromeExtensionInstallation {
    static isChromeOrChromium() {
        return navigator.userAgent.includes("Chrome") || navigator.userAgent.includes("Chromium");
    }
    static isSupported() {
        return AppRuntime_1.AppRuntime.isBrowser() && this.isChromeOrChromium();
    }
    static requiresInstall() {
        return this.isSupported() && !localStorage.getItem("skip-extension");
    }
    static isInstalled() {
        const anyChrome = chrome;
        if (!anyChrome) {
            return false;
        }
        const app = anyChrome.app;
        if (!app) {
            return false;
        }
        return Preconditions_1.isPresent(app.isInstalled) && app.isInstalled;
    }
    static doInstall(successCallback, failureCallback) {
        Analytics_1.Analytics.event({ category: 'chrome-extension', action: 'inline-installation-triggered' });
        const handleSuccess = () => {
            Analytics_1.Analytics.event({ category: 'chrome-extension-install-result', action: 'install-successful' });
            successCallback();
        };
        const handleFailure = (error, errorCode) => {
            Analytics_1.Analytics.event({ category: 'chrome-extension-install-result', action: 'install-failed' });
            if (errorCode) {
                Analytics_1.Analytics.event({ category: 'chrome-extension-failures', action: errorCode });
            }
            failureCallback(error, errorCode);
        };
        chrome.webstore.install(EXTENSION_URL, handleSuccess, handleFailure);
    }
}
exports.ChromeExtensionInstallation = ChromeExtensionInstallation;
//# sourceMappingURL=ChromeExtensionInstallation.js.map