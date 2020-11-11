"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceLayerTypes = exports.PersistenceLayerManager = void 0;
const SimpleReactor_1 = require("../reactor/SimpleReactor");
const RemotePersistenceLayerFactory_1 = require("./factories/RemotePersistenceLayerFactory");
const CloudPersistenceLayerFactory_1 = require("./factories/CloudPersistenceLayerFactory");
const Logger_1 = require("polar-shared/src/logger/Logger");
const WebPersistenceLayerFactory_1 = require("./factories/WebPersistenceLayerFactory");
const Latch_1 = require("polar-shared/src/util/Latch");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const log = Logger_1.Logger.create();
const RESET_KEY = 'polar-persistence-layer-reset';
class PersistenceLayerManager {
    constructor(opts) {
        this.opts = opts;
        this.persistenceLayerManagerEventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.initialized = new Latch_1.Latch();
        this.state = 'stopped';
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            let type = PersistenceLayerTypes.get();
            console.log("Using persistence layer type: " + type);
            if (this.requiresReset()) {
                log.info("Going go reset and deactivate current datastore: " + type);
                const deactivatePersistenceLayer = this.createPersistenceLayer(type);
                yield deactivatePersistenceLayer.deactivate();
                this.clearReset();
                type = 'local';
                PersistenceLayerTypes.set(type);
            }
            yield this.change(type);
            this.initialized.resolve(true);
            this.listenForPersistenceLayerChange();
        });
    }
    get() {
        return this.persistenceLayer;
    }
    getAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialized.get();
            return this.get();
        });
    }
    currentType() {
        return this.current;
    }
    change(type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.current === type) {
                return false;
            }
            PersistenceLayerTypes.set(type);
            if (this.persistenceLayer) {
                log.info("Stopping persistence layer...");
                this.dispatchEvent({ persistenceLayer: this.persistenceLayer, state: 'stopping' });
                yield this.persistenceLayer.createBackup();
                yield this.persistenceLayer.stop();
                log.info("Stopped persistence layer...");
                this.dispatchEvent({ persistenceLayer: this.persistenceLayer, state: 'stopped' });
            }
            this.current = type;
            this.persistenceLayer = this.createPersistenceLayer(type);
            this.dispatchEvent({ persistenceLayer: this.persistenceLayer, state: 'changed' });
            log.info("Changed to persistence layer: " + type);
            yield this.persistenceLayer.init(err => {
            }, this.opts);
            this.dispatchEvent({ persistenceLayer: this.persistenceLayer, state: 'initialized' });
            log.info("Initialized persistence layer: " + type);
            return true;
        });
    }
    reset() {
        log.info("Datastore reset");
        window.localStorage.setItem(RESET_KEY, 'true');
    }
    requiresReset() {
        return window.localStorage.getItem(RESET_KEY) === 'true';
    }
    clearReset() {
        return window.localStorage.removeItem(RESET_KEY);
    }
    createPersistenceLayer(type) {
        if (AppRuntime_1.AppRuntime.isBrowser()) {
            if (type !== 'web') {
                log.warn(`Only web type supported in browsers (requested type: ${type})`);
                type = 'web';
            }
        }
        if (type === 'web') {
            return WebPersistenceLayerFactory_1.WebPersistenceLayerFactory.create();
        }
        if (type === 'local') {
            return RemotePersistenceLayerFactory_1.RemotePersistenceLayerFactory.create();
        }
        if (type === 'cloud') {
            return CloudPersistenceLayerFactory_1.CloudPersistenceLayerFactory.create();
        }
        throw new Error("Unknown type: " + type);
    }
    addEventListener(listener, fireWithExisting) {
        if (fireWithExisting && this.get()) {
            listener({ persistenceLayer: this.get(), state: fireWithExisting });
        }
        return this.persistenceLayerManagerEventDispatcher.addEventListener(listener);
    }
    removeEventListener(listener) {
        return this.persistenceLayerManagerEventDispatcher.removeEventListener(listener);
    }
    dispatchEvent(event) {
        this.state = event.state;
        this.persistenceLayerManagerEventDispatcher.dispatchEvent(event);
    }
    listenForPersistenceLayerChange() {
        const whenChanged = (callback) => {
            let type = PersistenceLayerTypes.get();
            window.addEventListener('storage', () => {
                const newType = PersistenceLayerTypes.get();
                if (newType !== type) {
                    try {
                        callback(newType);
                    }
                    finally {
                        type = newType;
                    }
                }
            });
        };
        whenChanged((type) => {
            this.change(type)
                .catch(err => log.error("Unable to change to type: " + type));
        });
    }
}
exports.PersistenceLayerManager = PersistenceLayerManager;
class PersistenceLayerTypes {
    static get() {
        return 'web';
    }
    static set(type) {
        window.localStorage.setItem(this.KEY, type);
    }
}
exports.PersistenceLayerTypes = PersistenceLayerTypes;
PersistenceLayerTypes.KEY = 'polar-persistence-layer';
//# sourceMappingURL=PersistenceLayerManager.js.map