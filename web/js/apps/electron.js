"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PersistenceLayer_1 = require("../datastore/PersistenceLayer");
const Launcher_1 = require("./Launcher");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
function persistenceLayerFactory() {
    console.log("Using electron persistence layer and disk store");
    const remote = require('electron').remote;
    console.log("Accessing datastore...");
    let datastore = remote.getGlobal("datastore");
    console.log("Accessing datastore...done");
    return new PersistenceLayer_1.PersistenceLayer(datastore);
}
new Launcher_1.Launcher(persistenceLayerFactory).launch()
    .then(() => console.log("App now loaded."))
    .catch(err => log.error(err));
//# sourceMappingURL=electron.js.map