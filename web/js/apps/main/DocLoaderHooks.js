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
exports.useDocLoader = void 0;
const react_1 = __importDefault(require("react"));
const PersistenceLayerApp_1 = require("../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const BrowserTabsStore_1 = require("../../browser_tabs/BrowserTabsStore");
const ViewerURLs_1 = require("./doc_loaders/ViewerURLs");
const PersistentRoute_1 = require("../repository/PersistentRoute");
const BrowserDocLoader_1 = require("./doc_loaders/browser/BrowserDocLoader");
const RepositoryApp_1 = require("../repository/RepositoryApp");
function useDocLoaderElectron2() {
    const { addTab } = BrowserTabsStore_1.useBrowserTabsCallbacks();
    return useDocLoaderNull();
}
function useDocLoaderElectron() {
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
    const { addTab } = BrowserTabsStore_1.useBrowserTabsCallbacks();
    return react_1.default.useCallback((loadDocRequest) => {
        const viewerURL = ViewerURLs_1.ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
        const parsedURL = new URL(viewerURL);
        const path = parsedURL.pathname;
        return {
            load() {
                return __awaiter(this, void 0, void 0, function* () {
                    const tabDescriptor = {
                        url: path,
                        title: loadDocRequest.title,
                        component: (react_1.default.createElement(PersistentRoute_1.PersistentRoute, { exact: true, path: path },
                            react_1.default.createElement(RepositoryApp_1.RepositoryDocViewerScreen, { persistenceLayerProvider: persistenceLayerProvider })))
                    };
                    addTab(tabDescriptor);
                });
            }
        };
    }, [persistenceLayerProvider, addTab]);
}
function useDocLoaderDefault() {
    return BrowserDocLoader_1.useBrowserDocLoader();
}
function useDocLoaderNull() {
    return (loadDocRequest) => {
        return {
            load() {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("Used null DocLoader");
                });
            }
        };
    };
}
exports.useDocLoader = useDocLoaderDefault;
//# sourceMappingURL=DocLoaderHooks.js.map