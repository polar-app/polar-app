"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPathException = exports.ResourcePaths = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
const URLs_1 = require("polar-shared/src/util/URLs");
const USE_FILE_URL = false;
class ResourcePaths {
    static absoluteFromRelativePath(relativePath) {
        const baseDirs = ResourcePaths.getBaseDirs();
        for (const baseDir of baseDirs) {
            const absolutePath = path_1.default.resolve(baseDir, relativePath);
            try {
                fs_1.default.readFileSync(absolutePath);
                return absolutePath;
            }
            catch (e) {
            }
        }
        throw new Error(`No file found for ${relativePath} in baseDirs: ` + JSON.stringify(baseDirs));
    }
    static resourceURLFromRelativeURL(relativeURL, useFileURL = USE_FILE_URL) {
        let relativePath = relativeURL;
        let queryData = "";
        if (relativeURL.indexOf("?") !== -1) {
            relativePath = relativeURL.substring(0, relativeURL.indexOf("?"));
            queryData = relativeURL.substring(relativeURL.indexOf("?"));
        }
        if (useFileURL) {
            const absolutePath = ResourcePaths.absoluteFromRelativePath(relativePath);
            return 'file://' + absolutePath + queryData;
        }
        else {
            const computeBase = () => {
                if (typeof window !== 'undefined' && window.location) {
                    return URLs_1.URLs.toBase(window.location.href);
                }
                return "http://localhost:8500";
            };
            const base = computeBase();
            return base + relativeURL;
        }
    }
    static getBaseDirs() {
        const baseDirs = [];
        if (!Preconditions_1.isPresent(electron_1.app)) {
            baseDirs.push(electron_1.remote.app.getAppPath());
        }
        else {
            baseDirs.push(electron_1.app.getAppPath());
        }
        baseDirs.push(process.cwd());
        return baseDirs;
    }
}
exports.ResourcePaths = ResourcePaths;
class AppPathException extends Error {
}
exports.AppPathException = AppPathException;
//# sourceMappingURL=ResourcePaths.js.map