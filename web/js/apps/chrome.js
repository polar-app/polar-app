"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Launcher_1 = require("./Launcher");
const FirebasePersistenceLayerFactory_1 = require("../datastore/factories/FirebasePersistenceLayerFactory");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
function persistenceLayerFactory() {
    return __awaiter(this, void 0, void 0, function* () {
        const persistenceLayer = FirebasePersistenceLayerFactory_1.FirebasePersistenceLayerFactory.create();
        yield persistenceLayer.init();
        return persistenceLayer;
    });
}
new Launcher_1.Launcher(persistenceLayerFactory).launch()
    .then(() => log.info("App now loaded."))
    .catch(err => log.error(err));
//# sourceMappingURL=chrome.js.map