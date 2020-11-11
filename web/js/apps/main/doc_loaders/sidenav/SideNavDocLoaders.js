"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSideNavDocLoader = void 0;
const PersistenceLayerApp_1 = require("../../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const DocMigration_1 = require("../DocMigration");
const react_1 = __importDefault(require("react"));
const ViewerURLs_1 = require("../ViewerURLs");
const SideNavStore_1 = require("../../../../sidenav/SideNavStore");
function useSideNavDocLoader() {
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
    const docMigration = DocMigration_1.useDocMigration();
    const { addTab } = SideNavStore_1.useSideNavCallbacks();
    return react_1.default.useCallback((loadDocRequest) => {
        if (!docMigration(loadDocRequest)) {
            const viewerURL = ViewerURLs_1.ViewerURLs.create(persistenceLayerProvider, loadDocRequest);
            const url = viewerURL.replace("http://localhost:8050", "");
            addTab({
                url,
                title: loadDocRequest.title,
            });
        }
    }, [addTab, docMigration, persistenceLayerProvider]);
}
exports.useSideNavDocLoader = useSideNavDocLoader;
//# sourceMappingURL=SideNavDocLoaders.js.map