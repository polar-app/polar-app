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
exports.SpectronWebappMain = void 0;
const AppPath_1 = require("../electron/app_path/AppPath");
const SpectronMain2_1 = require("./SpectronMain2");
const PolarDataDir_1 = require("./PolarDataDir");
const WebserverConfig_1 = require("polar-shared-webserver/src/webserver/WebserverConfig");
const FileRegistry_1 = require("polar-shared-webserver/src/webserver/FileRegistry");
const Webserver_1 = require("polar-shared-webserver/src/webserver/Webserver");
class SpectronWebappMain {
    static run(opts) {
        console.log("Running spectron webapp with: ", opts);
        const { appRoot, webRoot, path, rewrites } = opts;
        AppPath_1.AppPath.set(appRoot);
        SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(this, void 0, void 0, function* () {
            yield PolarDataDir_1.PolarDataDir.useFreshDirectory('.polar-firebase-datastore');
            console.log("Running with app path: " + AppPath_1.AppPath.get());
            console.log("Running with web root: " + webRoot);
            if (opts.initializer) {
                console.log("Running initializer...");
                yield opts.initializer();
                console.log("Running initializer...done");
            }
            const webserverConfig = WebserverConfig_1.WebserverConfigs.create({ dir: webRoot, port: 8005, rewrites });
            const fileRegistry = new FileRegistry_1.FileRegistry(webserverConfig);
            const webserver = new Webserver_1.Webserver(webserverConfig, fileRegistry);
            try {
                yield webserver.start();
            }
            catch (e) {
                console.warn("Webserver already running.");
            }
            const url = `http://localhost:8005${path}`;
            yield state.window.loadURL(url);
        }));
    }
}
exports.SpectronWebappMain = SpectronWebappMain;
//# sourceMappingURL=SpectronWebappMain.js.map