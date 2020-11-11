"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudPersistenceLayerFactory = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const DefaultPersistenceLayer_1 = require("../DefaultPersistenceLayer");
const AdvertisingPersistenceLayer_1 = require("../advertiser/AdvertisingPersistenceLayer");
const CloudAwareDatastore_1 = require("../CloudAwareDatastore");
const FirebaseDatastore_1 = require("../FirebaseDatastore");
const HybridRemoteDatastores_1 = require("../HybridRemoteDatastores");
const TracedDatastore_1 = require("../TracedDatastore");
const log = Logger_1.Logger.create();
class CloudPersistenceLayerFactory {
    static create() {
        log.info("Using remote persistence layer and cloud aware data store");
        const local = HybridRemoteDatastores_1.HybridRemoteDatastores.create();
        const cloud = new TracedDatastore_1.TracedDatastore(new FirebaseDatastore_1.FirebaseDatastore(), 'traced-firebase');
        const datastore = new CloudAwareDatastore_1.CloudAwareDatastore(local, cloud);
        const defaultPersistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer_1.AdvertisingPersistenceLayer(defaultPersistenceLayer);
        return advertisingPersistenceLayer;
    }
}
exports.CloudPersistenceLayerFactory = CloudPersistenceLayerFactory;
//# sourceMappingURL=CloudPersistenceLayerFactory.js.map