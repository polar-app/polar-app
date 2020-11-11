"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteDatastores = void 0;
const RemoteDatastore_1 = require("./RemoteDatastore");
var RemoteDatastores;
(function (RemoteDatastores) {
    function create() {
        const { remote } = window.require('electron');
        const datastore = remote.getGlobal("datastore");
        return new RemoteDatastore_1.RemoteDatastore(datastore);
    }
    RemoteDatastores.create = create;
})(RemoteDatastores = exports.RemoteDatastores || (exports.RemoteDatastores = {}));
//# sourceMappingURL=RemoteDatastores.js.map