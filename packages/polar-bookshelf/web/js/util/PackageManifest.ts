
const pkg: any = require("../../../package.json");

export class PackageManifest {

    version(): string {
        return pkg.version;
    }

    name(): string {
        return pkg.name;
    }

}
