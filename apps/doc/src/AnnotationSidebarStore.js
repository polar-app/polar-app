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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnnotationSidebarMutator = exports.useAnnotationSidebarCallbacks = exports.useAnnotationSidebarStore = exports.AnnotationSidebarStoreProvider = void 0;
const React = __importStar(require("react"));
const ObservableStore_1 = require("../../../web/js/react/store/ObservableStore");
const AnnotationRepoFilters2_1 = require("../../repository/js/annotation_repo/AnnotationRepoFilters2");
const DocAnnotationSorter_1 = require("../../../web/js/annotation_sidebar/DocAnnotationSorter");
const DocAnnotationLoader2_1 = require("../../../web/js/annotation_sidebar/DocAnnotationLoader2");
const DocFileResolvers_1 = require("../../../web/js/datastore/DocFileResolvers");
const PersistenceLayerApp_1 = require("../../repository/js/persistence_layer/PersistenceLayerApp");
const Mapper_1 = require("polar-shared/src/util/Mapper");
const DocAnnotations_1 = require("../../../web/js/annotation_sidebar/DocAnnotations");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const initialStore = {
    filter: "",
    data: [],
    view: []
};
function mutatorFactory(storeProvider, setStore) {
    function reduce(store, mutation) {
        switch (mutation.mutation) {
            case "set-filter":
                if (mutation.filter !== store.filter) {
                    const view = AnnotationRepoFilters2_1.AnnotationRepoFilters2.execute(store.data, { text: mutation.filter });
                    return Object.assign(Object.assign(Object.assign({}, store), mutation), { view });
                }
                else {
                    return store;
                }
            case "set-data":
                const data = mutation.data;
                const view = Mapper_1.Mappers.create(data)
                    .map(DocAnnotationSorter_1.DocAnnotationSorter.sort)
                    .map(data => AnnotationRepoFilters2_1.AnnotationRepoFilters2.execute(data, { text: store.filter }))
                    .collect();
                return Object.assign(Object.assign({}, store), { data, view });
        }
        return store;
    }
    function doUpdate(mutation) {
        const store = storeProvider();
        const newStore = reduce(store, mutation);
        setStore(newStore);
    }
    return { doUpdate };
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const persistenceLayerContext = PersistenceLayerApp_1.usePersistenceLayerContext();
    return React.useMemo(() => {
        function setFilter(text) {
            mutator.doUpdate({ mutation: 'set-filter', filter: text });
        }
        function toAnnotations(docMeta) {
            const { persistenceLayerProvider } = persistenceLayerContext;
            const docFileResolver = DocFileResolvers_1.DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
            return DocAnnotationLoader2_1.DocAnnotationLoader2.load(docMeta, docFileResolver).map(DocAnnotations_1.DocAnnotations.toRef);
        }
        function setDocMeta(docMeta) {
            Preconditions_1.Preconditions.assertPresent(docMeta, 'docMeta');
            const data = toAnnotations(docMeta);
            mutator.doUpdate({ mutation: 'set-data', data });
        }
        return ({
            setFilter,
            setDocMeta
        });
    }, [persistenceLayerContext, mutator]);
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.AnnotationSidebarStoreProvider = _a[0], exports.useAnnotationSidebarStore = _a[1], exports.useAnnotationSidebarCallbacks = _a[2], exports.useAnnotationSidebarMutator = _a[3];
//# sourceMappingURL=AnnotationSidebarStore.js.map