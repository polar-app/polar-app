"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Firestore = void 0;
const firebase = __importStar(require("firebase/app"));
require("firebase/firestore");
const Providers_1 = require("polar-shared/src/util/Providers");
const Firebase_1 = require("./Firebase");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Tracer_1 = require("polar-shared/src/util/Tracer");
const log = Logger_1.Logger.create();
var Firestore;
(function (Firestore) {
    let instance;
    function initDelegate(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            Firebase_1.Firebase.init();
            return yield createInstance(opts);
        });
    }
    const firestoreProvider = Providers_1.AsyncProviders.memoize1(initDelegate);
    function init(opts = { enablePersistence: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance) {
                return;
            }
            instance = yield firestoreProvider(opts);
            return instance;
        });
    }
    Firestore.init = init;
    function getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield init();
            return instance;
        });
    }
    Firestore.getInstance = getInstance;
    function createInstance(opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const doExecAsync = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    log.notice("Initializing firestore...");
                    const firestore = firebase.firestore();
                    const settings = {
                        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
                    };
                    firestore.settings(settings);
                    if (opts.enablePersistence) {
                        yield enablePersistence(firestore);
                    }
                    return firestore;
                }
                finally {
                    log.notice("Initializing firestore...done");
                }
            });
            return yield Tracer_1.Tracer.async(doExecAsync, 'Firestore.createInstance');
        });
    }
    function enablePersistence(firestore) {
        return __awaiter(this, void 0, void 0, function* () {
            const doExecAsync = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Enabling firestore persistence....");
                    yield firestore.enablePersistence({ synchronizeTabs: true });
                    console.log("Enabling firestore persistence....done");
                }
                catch (e) {
                    console.warn("Unable to use persistence. Data will not be cached locally: ", e);
                }
            });
            yield Tracer_1.Tracer.async(doExecAsync, 'Firestore.enablePersistence');
        });
    }
})(Firestore = exports.Firestore || (exports.Firestore = {}));
//# sourceMappingURL=Firestore.js.map