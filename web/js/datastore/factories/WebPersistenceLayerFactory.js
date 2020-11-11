"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullListenablePersistenceLayer = exports.WebPersistenceLayerFactory = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const DefaultPersistenceLayer_1 = require("../DefaultPersistenceLayer");
const FirebaseDatastore_1 = require("../FirebaseDatastore");
const AbstractAdvertisingPersistenceLayer_1 = require("../advertiser/AbstractAdvertisingPersistenceLayer");
const Firebase_1 = require("../../firebase/Firebase");
const SharingDatastores_1 = require("../SharingDatastores");
const TracedDatastore_1 = require("../TracedDatastore");
const DataFileCacheDatastore_1 = require("../DataFileCacheDatastore");
const log = Logger_1.Logger.create();
class WebPersistenceLayerFactory {
    static create() {
        const toDatastore = () => {
            if (SharingDatastores_1.SharingDatastores.isSupported()) {
                return SharingDatastores_1.SharingDatastores.create();
            }
            else {
                Firebase_1.Firebase.init();
                const firebaseDatastore = new FirebaseDatastore_1.FirebaseDatastore();
                const dataFileCacheDatastore = new DataFileCacheDatastore_1.DataFileCacheDatastore(firebaseDatastore);
                const tracedDatastore = new TracedDatastore_1.TracedDatastore(dataFileCacheDatastore, 'traced-firebase');
                return tracedDatastore;
            }
        };
        const datastore = toDatastore();
        log.info("Using datastore: " + datastore.id);
        return new NullListenablePersistenceLayer(new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore));
    }
}
exports.WebPersistenceLayerFactory = WebPersistenceLayerFactory;
class NullListenablePersistenceLayer extends AbstractAdvertisingPersistenceLayer_1.AbstractAdvertisingPersistenceLayer {
    constructor(delegate) {
        super(delegate);
        this.id = 'null';
    }
    broadcastEvent(event) {
    }
}
exports.NullListenablePersistenceLayer = NullListenablePersistenceLayer;
//# sourceMappingURL=WebPersistenceLayerFactory.js.map