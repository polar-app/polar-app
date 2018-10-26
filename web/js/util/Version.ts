
const pkg: any = require("../../../package.json");

export class Version {

    public static get(): string {
        return pkg.version;
    }

}
