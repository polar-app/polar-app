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
exports.Repository = void 0;
const ReactDOM = __importStar(require("react-dom"));
const React = __importStar(require("react"));
const SimpleReactor_1 = require("../../reactor/SimpleReactor");
const AppInstance_1 = require("../../electron/framework/AppInstance");
const PersistenceLayerManager_1 = require("../../datastore/PersistenceLayerManager");
const Logger_1 = require("polar-shared/src/logger/Logger");
const RepoDocMetaManager_1 = require("../../../../apps/repository/js/RepoDocMetaManager");
const RepoDocMetaLoader_1 = require("../../../../apps/repository/js/RepoDocMetaLoader");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const RepoDocMetas_1 = require("../../../../apps/repository/js/RepoDocMetas");
const Accounts_1 = require("../../accounts/Accounts");
const AppInitializer_1 = require("./AppInitializer");
const RepositoryApp_1 = require("./RepositoryApp");
const Tracer_1 = require("polar-shared/src/util/Tracer");
const AuthHandler_1 = require("./auth_handler/AuthHandler");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const log = Logger_1.Logger.create();
class Repository {
    constructor(persistenceLayerManager = new PersistenceLayerManager_1.PersistenceLayerManager(), repoDocMetaManager = new RepoDocMetaManager_1.RepoDocMetaManager(persistenceLayerManager), repoDocMetaLoader = new RepoDocMetaLoader_1.RepoDocMetaLoader(persistenceLayerManager)) {
        this.persistenceLayerManager = persistenceLayerManager;
        this.repoDocMetaManager = repoDocMetaManager;
        this.repoDocMetaLoader = repoDocMetaLoader;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Starting repository with app runtime: " + AppRuntime_1.AppRuntime.get());
            const updatedDocInfoEventDispatcher = new SimpleReactor_1.SimpleReactor();
            const persistenceLayerManager = this.persistenceLayerManager;
            const app = yield AppInitializer_1.AppInitializer.init({
                persistenceLayerManager,
                onNeedsAuthentication: (app) => __awaiter(this, void 0, void 0, function* () {
                    updatedDocInfoEventDispatcher.addEventListener(docInfo => {
                        this.onUpdatedDocInfo(app, docInfo);
                    });
                    app.persistenceLayerManager.addEventListener(event => {
                        if (event.state === 'changed') {
                            event.persistenceLayer.addEventListener((persistenceLayerEvent) => {
                                this.onUpdatedDocInfo(app, persistenceLayerEvent.docInfo);
                            });
                        }
                    });
                })
            });
            Accounts_1.Accounts.listenForPlanUpgrades()
                .catch(err => log.error("Unable to listen for plan upgrades: ", err));
            const rootElement = getRootElement();
            ReactDOM.render(React.createElement(RepositoryApp_1.RepositoryApp, { app: app, persistenceLayerManager: persistenceLayerManager, repoDocMetaManager: this.repoDocMetaManager, repoDocMetaLoader: this.repoDocMetaLoader, updatedDocInfoEventDispatcher: updatedDocInfoEventDispatcher, onFileUpload: this.onFileUpload }), rootElement);
            const handleAuth = () => __awaiter(this, void 0, void 0, function* () {
                const authHandler = AuthHandler_1.AuthHandlers.get();
                console.log("Getting auth status...");
                const authStatus = yield Tracer_1.Tracer.async(authHandler.status(), 'auth-handler');
                console.log("Getting auth status...done");
                if (authStatus.type !== 'needs-authentication') {
                    this.handleRepoDocInfoEvents();
                    yield this.repoDocMetaLoader.start();
                    yield persistenceLayerManager.start();
                    console.log("Started repo doc loader.");
                }
            });
            handleAuth()
                .catch(err => log.error("Could not handle auth: ", err));
            AppInstance_1.AppInstance.notifyStarted('RepositoryApp');
        });
    }
    onFileUpload() {
        console.log("File uploaded and sending event via postMessage");
        window.postMessage({ type: 'file-uploaded' }, '*');
    }
    handleRepoDocInfoEvents() {
        this.repoDocMetaLoader.addEventListener(event => {
            for (const mutation of event.mutations) {
                if (mutation.mutationType === 'created' || mutation.mutationType === 'updated') {
                    this.repoDocMetaManager.updateFromRepoDocMeta(mutation.fingerprint, mutation.repoDocMeta);
                }
                else {
                    this.repoDocMetaManager.updateFromRepoDocMeta(mutation.fingerprint, undefined);
                }
            }
        });
    }
    doLoadExampleDocs(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const doLoad = () => __awaiter(this, void 0, void 0, function* () {
            });
            app.persistenceLayerManager.addEventListener(event => {
                if (event.state === 'initialized') {
                    doLoad()
                        .catch(err => log.error("Unable to load example docs: ", err));
                }
            });
        });
    }
    onUpdatedDocInfo(app, docInfo) {
        const persistenceLayerProvider = () => app.persistenceLayerManager.get();
        const handleUpdatedDocInfo = () => __awaiter(this, void 0, void 0, function* () {
            log.info("Received DocInfo update");
            const persistenceLayer = app.persistenceLayerManager.get();
            const docMeta = yield persistenceLayer.getDocMeta(docInfo.fingerprint);
            if (!docMeta) {
                throw new Error("No DocMeta");
            }
            const repoDocMeta = RepoDocMetas_1.RepoDocMetas.convert(persistenceLayerProvider, docInfo.fingerprint, docMeta);
            const validity = RepoDocMetas_1.RepoDocMetas.isValid(repoDocMeta);
            if (validity === 'valid') {
                this.repoDocMetaManager.updateFromRepoDocMeta(docInfo.fingerprint, repoDocMeta);
                const progress = new ProgressTracker_1.ProgressTracker({ total: 1, id: 'doc-info-update' }).terminate();
                this.repoDocMetaLoader.dispatchEvent({
                    mutations: [
                        {
                            mutationType: 'created',
                            fingerprint: docInfo.fingerprint,
                            repoDocMeta
                        }
                    ],
                    progress
                });
                const persistenceLayer = app.persistenceLayerManager.get();
                if (PersistenceLayerManager_1.PersistenceLayerTypes.get() === 'cloud') {
                    const handleWriteDocMeta = () => __awaiter(this, void 0, void 0, function* () {
                        yield persistenceLayer.synchronizeDocs({
                            fingerprint: docInfo.fingerprint,
                            docMetaProvider: () => Promise.resolve(docMeta)
                        });
                    });
                    handleWriteDocMeta()
                        .catch(err => log.error("Unable to write docMeta to datastore: ", err));
                }
            }
            else {
                log.warn(`We were given an invalid DocInfo which yielded a broken RepoDocMeta ${validity}: `, docInfo, repoDocMeta);
            }
        });
        handleUpdatedDocInfo()
            .catch(err => log.error("Unable to update doc info with fingerprint: " + docInfo.fingerprint, err));
    }
}
exports.Repository = Repository;
function getRootElement() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error("No root element to which to render");
    }
    return rootElement;
}
//# sourceMappingURL=Repository.js.map