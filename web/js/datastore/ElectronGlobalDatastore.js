"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronGlobalDatastore = void 0;
const Datastores_1 = require("./Datastores");
class ElectronGlobalDatastore {
    static create() {
        const datastore = Datastores_1.Datastores.create();
        global.datastore = datastore;
        return datastore;
    }
}
exports.ElectronGlobalDatastore = ElectronGlobalDatastore;
//# sourceMappingURL=ElectronGlobalDatastore.js.map