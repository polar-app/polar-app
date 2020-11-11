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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBrowserDocLoader = exports.BrowserDocLoader = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ViewerURLs_1 = require("../ViewerURLs");
const DocURLLoader_1 = require("./DocURLLoader");
const PersistenceLayerApp_1 = require("../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const DocMigration_1 = require("../DocMigration");
const react_1 = __importDefault(require("react"));
class BrowserDocLoader {
    constructor(persistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.persistenceLayerProvider = persistenceLayerProvider;
    }
    create(loadDocRequest) {
        const viewerURL = ViewerURLs_1.ViewerURLs.create(this.persistenceLayerProvider, loadDocRequest);
        const linkLoader = DocURLLoader_1.DocURLLoader.create();
        Preconditions_1.Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
        Preconditions_1.Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
        Preconditions_1.Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");
        return {
            load() {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("Loading URL: ", viewerURL);
                    linkLoader(viewerURL);
                });
            }
        };
    }
}
exports.BrowserDocLoader = BrowserDocLoader;
function useBrowserDocLoader() {
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
    const docURLLoader = DocURLLoader_1.useDocURLLoader();
    const docMigration = DocMigration_1.useDocMigration();
    return react_1.default.useCallback((loadDocRequest) => {
        if (!docMigration(loadDocRequest)) {
            const viewerURL = ViewerURLs_1.ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
            docURLLoader(viewerURL);
        }
    }, [docMigration, docURLLoader, persistenceLayerProvider]);
}
exports.useBrowserDocLoader = useBrowserDocLoader;
//# sourceMappingURL=BrowserDocLoader.js.map