"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemotePersistenceLayerFactory = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const DefaultPersistenceLayer_1 = require("../DefaultPersistenceLayer");
const AdvertisingPersistenceLayer_1 = require("../advertiser/AdvertisingPersistenceLayer");
const HybridRemoteDatastores_1 = require("../HybridRemoteDatastores");
const log = Logger_1.Logger.create();
class RemotePersistenceLayerFactory {
    static create() {
        log.info("Using remote persistence layer and disk store");
        const datastore = HybridRemoteDatastores_1.HybridRemoteDatastores.create();
        const defaultPersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer_1.AdvertisingPersistenceLayer(defaultPersistenceLayer);
        return advertisingPersistenceLayer;
    }
}
exports.RemotePersistenceLayerFactory = RemotePersistenceLayerFactory;
//# sourceMappingURL=RemotePersistenceLayerFactory.js.map