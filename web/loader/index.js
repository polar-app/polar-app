"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const url_1 = __importDefault(require("url"));
const electron_1 = require("electron");
function load(loadPath) {
    const os_type = os_1.default.type();
    return _loadFromHref(document.location.href, loadPath, os_type);
}
exports.load = load;
function loadFromAppPath(relativePath) {
    const appPath = electron_1.remote.getGlobal("appPath");
    const entryPoint = path_1.default.join(appPath, relativePath);
    require(entryPoint);
}
exports.loadFromAppPath = loadFromAppPath;
function _loadFromHref(href, loadPath, os_type) {
    const resolvedPath = _resolveFromHref(href, loadPath, os_type);
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
function _toPathFromFileURL(href, os_type) {
    let result = href;
    result = result.replace('file://', '');
    if (os_type === 'Windows_NT') {
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
function _resolveFromHref(href, loadPath, os_type) {
    const resolvedURL = _resolveURL(href, loadPath);
    const resolvedPath = _toPath(resolvedURL, loadPath, os_type);
    if (!fs_1.default.existsSync(resolvedPath)) {
        throw new Error(`Could not find ${loadPath} (not found): ${resolvedPath}`);
    }
    return resolvedPath;
}
exports._resolveFromHref = _resolveFromHref;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUtBLGdEQUF3QjtBQUN4Qiw0Q0FBb0I7QUFDcEIsNENBQW9CO0FBQ3BCLDhDQUFzQjtBQUN0Qix1Q0FBZ0M7QUFXaEMsU0FBZ0IsSUFBSSxDQUFDLFFBQWdCO0lBT2pDLE1BQU0sT0FBTyxHQUFHLFlBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUxQixPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDckUsQ0FBQztBQVZELG9CQVVDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLFlBQW9CO0lBQ2hELE1BQU0sT0FBTyxHQUFHLGlCQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3BELE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBSkQsMENBSUM7QUFTRCxTQUFnQixhQUFhLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsT0FBZTtJQUN6RSxNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBSEQsc0NBR0M7QUFVRCxTQUFnQixPQUFPLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsT0FBZTtJQUVuRSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDNUM7SUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN2RCxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7S0FFbkQ7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQyxDQUFDO0FBRXpELENBQUM7QUFiRCwwQkFhQztBQVFELFNBQWdCLGtCQUFrQixDQUFDLElBQVksRUFBRSxPQUFlO0lBRTVELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztJQUlsQixNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFTdkMsSUFBSSxPQUFPLEtBQUssWUFBWSxFQUFFO1FBRzFCLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBUzdCLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUcxQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FFeEM7SUFHRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV0RCxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTNCLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUF4Q0QsZ0RBd0NDO0FBU0QsU0FBZ0IsV0FBVyxDQUFDLElBQVksRUFBRSxFQUFVO0lBQ2hELE9BQU8sYUFBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUZELGtDQUVDO0FBVUQsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsT0FBZTtJQUU1RSxNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRWhELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBRSxZQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLFFBQVEsaUJBQWlCLFlBQVksRUFBRSxDQUFDLENBQUM7S0FDOUU7SUFFRCxPQUFPLFlBQVksQ0FBQztBQUV4QixDQUFDO0FBWkQsNENBWUMifQ==