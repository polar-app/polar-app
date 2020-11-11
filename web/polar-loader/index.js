"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._resolveFromHref = exports._resolveURL = exports._toPathFromFileURL = exports._toPath = exports._loadFromHref = exports.loadFromAppPath = exports.load = exports.injectScript = exports.injectApp = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const url_1 = __importDefault(require("url"));
const electron_1 = require("electron");
function injectApp(scriptSrc, fallbackLoader) {
    if (typeof require === 'function') {
        console.log("Loading via fallbackLoader");
        fallbackLoader();
    }
    else {
        console.log("Loading via script");
        injectScript(scriptSrc);
    }
}
exports.injectApp = injectApp;
function injectScript(src, type) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = false;
    if (type) {
        script.type = type;
    }
    document.body.appendChild(script);
}
exports.injectScript = injectScript;
function load(loadPath) {
    const osType = os_1.default.type();
    return _loadFromHref(document.location.href, loadPath, osType);
}
exports.load = load;
function loadFromAppPath(relativePath) {
    const appPath = electron_1.remote.getGlobal("appPath");
    const entryPoint = path_1.default.join(appPath, relativePath);
    require(entryPoint);
}
exports.loadFromAppPath = loadFromAppPath;
function _loadFromHref(href, loadPath, osType) {
    const resolvedPath = _resolveFromHref(href, loadPath, osType);
    require(resolvedPath);
}
exports._loadFromHref = _loadFromHref;
function _toPath(href, loadPath, os_type) {
    if (href.startsWith('file:')) {
        return _toPathFromFileURL(href, os_type);
    }
    if (href.startsWith('http:') || href.startsWith('https:')) {
        throw new Error("http and https not supported");
    }
    throw new Error("Unable to load from href: " + href);
}
exports._toPath = _toPath;
function _toPathFromFileURL(href, osType) {
    let result = href;
    result = result.replace('file://', '');
    if (osType === 'Windows_NT') {
        result = result.substring(1);
        result = result.replace(/^(.+)\|/, '$1:');
        result = result.replace(/\//g, '\\');
    }
    result = result.replace(/[^/.]+\.html([#?].*)?$/, '');
    result = decodeURI(result);
    return result;
}
exports._toPathFromFileURL = _toPathFromFileURL;
function _resolveURL(from, to) {
    return url_1.default.resolve(from, to);
}
exports._resolveURL = _resolveURL;
function _resolveFromHref(href, loadPath, osType) {
    const resolvedURL = _resolveURL(href, loadPath);
    const resolvedPath = _toPath(resolvedURL, loadPath, osType);
    if (!fs_1.default.existsSync(resolvedPath)) {
        throw new Error(`Could not find ${loadPath} (not found): ${resolvedPath}`);
    }
    return resolvedPath;
}
exports._resolveFromHref = _resolveFromHref;
//# sourceMappingURL=index.js.map