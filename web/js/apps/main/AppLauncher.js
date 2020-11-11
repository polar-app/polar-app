"use strict";
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
exports.AppLauncher = void 0;
const MainAppBrowserWindowFactory_1 = require("./MainAppBrowserWindowFactory");
const ResourcePaths_1 = require("../../electron/webresource/ResourcePaths");
const SingletonBrowserWindow_1 = require("../../electron/framework/SingletonBrowserWindow");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const log = Logger_1.Logger.create();
class AppLauncher {
    static launchRepositoryApp() {
        return __awaiter(this, void 0, void 0, function* () {
            const browserWindowTag = { name: 'app', value: 'repository' };
            const browserWindow = yield SingletonBrowserWindow_1.SingletonBrowserWindow.getInstance(browserWindowTag, () => __awaiter(this, void 0, void 0, function* () {
                const url = ResourcePaths_1.ResourcePaths.resourceURLFromRelativeURL('/', false);
                log.info("Loading app from URL: " + url);
                const browserWindowOptions = Dictionaries_1.Dictionaries.copyOf(MainAppBrowserWindowFactory_1.BROWSER_WINDOW_OPTIONS);
                browserWindowOptions.webPreferences.partition = MainAppBrowserWindowFactory_1.MAIN_SESSION_PARTITION_NAME;
                return yield MainAppBrowserWindowFactory_1.MainAppBrowserWindowFactory.createWindow(browserWindowOptions, url);
            }));
            browserWindow.focus();
            return browserWindow;
        });
    }
}
exports.AppLauncher = AppLauncher;
//# sourceMappingURL=AppLauncher.js.map