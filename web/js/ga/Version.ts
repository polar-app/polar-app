
const pkg: any = require("../../../package.json");

export class Version {

    static get(): string {
        return pkg.version;
    }

}
