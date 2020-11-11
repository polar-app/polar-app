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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHZMigrationTrigger = exports.PHZMigrationScreen = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const PHZMigrationClient_1 = require("polar-web-extension-api/src/PHZMigrationClient");
const AuthRequired_1 = require("../../../../../apps/repository/js/AuthRequired");
const WebExtensionPresenceClient_1 = require("polar-web-extension-api/src/WebExtensionPresenceClient");
const ChromeStoreURLs_1 = require("polar-web-extension-api/src/ChromeStoreURLs");
exports.PHZMigrationScreen = () => (react_1.default.createElement(AuthRequired_1.AuthRequired, null,
    react_1.default.createElement(exports.PHZMigrationTrigger, null)));
exports.PHZMigrationTrigger = () => {
    const location = react_router_dom_1.useLocation();
    const history = react_router_dom_1.useHistory();
    console.log("Triggered PHZ migration");
    const parsedURL = new URL(document.location.href);
    const docID = parsedURL.searchParams.get('docID');
    const url = parsedURL.searchParams.get('url');
    if (docID && url) {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("Testing if web extension installed");
                const presence = yield WebExtensionPresenceClient_1.WebExtensionPresenceClient.exec();
                if (!presence) {
                    console.log("Web extension NOT installed.");
                    const chromeStoreURL = ChromeStoreURLs_1.ChromeStoreURLs.create();
                    history.push(chromeStoreURL);
                    return;
                }
                else {
                    console.log("Web extension installed.");
                }
                yield PHZMigrationClient_1.PHZMigrationClient.exec({ docID, url });
            });
        }
        doAsync().catch(err => console.error(err));
        return null;
    }
    else {
        console.warn("No docID or URL: ", { docID, url });
        return null;
    }
};
//# sourceMappingURL=PHZMigrationScreen.js.map