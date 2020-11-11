"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocFileResolvers = void 0;
class DocFileResolvers {
    static createForPersistenceLayer(persistenceLayerProvider) {
        return (backend, ref, opts) => {
            const persistenceLayer = persistenceLayerProvider();
            return persistenceLayer.getFile(backend, ref, opts);
        };
    }
}
exports.DocFileResolvers = DocFileResolvers;
//# sourceMappingURL=DocFileResolvers.js.map