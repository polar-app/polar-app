"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageManifest = void 0;
const pkg = require("../../../package.json");
class PackageManifest {
    version() {
        return pkg.version;
    }
    name() {
        return pkg.name;
    }
}
exports.PackageManifest = PackageManifest;
//# sourceMappingURL=PackageManifest.js.map