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
exports.WebserverTester = void 0;
const AppPath_1 = require("../../electron/app_path/AppPath");
const WebserverConfig_1 = require("polar-shared-webserver/src/webserver/WebserverConfig");
const FileRegistry_1 = require("polar-shared-webserver/src/webserver/FileRegistry");
const Webserver_1 = require("polar-shared-webserver/src/webserver/Webserver");
class WebserverTester {
    static run(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            AppPath_1.AppPath.set(dir);
            const webserverConfig = new WebserverConfig_1.WebserverConfig(AppPath_1.AppPath.get(), 8005);
            const fileRegistry = new FileRegistry_1.FileRegistry(webserverConfig);
            const webserver = new Webserver_1.Webserver(webserverConfig, fileRegistry);
            try {
                yield webserver.start();
            }
            catch (e) {
                console.warn("Webserver already running.");
                throw e;
            }
        });
    }
}
exports.WebserverTester = WebserverTester;
//# sourceMappingURL=WebserverTester.js.map