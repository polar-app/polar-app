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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRepoStore2 = exports.useAnnotationRepoMutator = exports.useAnnotationRepoCallbacks = exports.useAnnotationRepoStore = exports.AnnotationRepoStoreProvider = void 0;
const React = __importStar(require("react"));
const Mapper_1 = require("polar-shared/src/util/Mapper");
const AnnotationRepoFilters2_1 = require("./AnnotationRepoFilters2");
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const PersistenceLayerApp_1 = require("../persistence_layer/PersistenceLayerApp");
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
const TagSidebarEventForwarder_1 = require("../store/TagSidebarEventForwarder");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const BackendFileRefs_1 = require("../../../../web/js/datastore/BackendFileRefs");
const Either_1 = require("../../../../web/js/util/Either");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const AnnotationMutations_1 = require("polar-shared/src/metadata/mutations/AnnotationMutations");
const Exporters_1 = require("../../../../web/js/metadata/exporter/Exporters");
const AnnotationMutationsContext_1 = require("../../../../web/js/annotation_sidebar/AnnotationMutationsContext");
const SelectionEvents2_1 = require("../doc_repo/SelectionEvents2");
const RepoDocMetas_1 = require("../RepoDocMetas");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const AddFileDropzone_1 = require("../../../../web/js/apps/repository/upload/AddFileDropzone");
const DocLoaderHooks_1 = require("../../../../web/js/apps/main/DocLoaderHooks");
const AnnotationMutationCallbacks_1 = require("../../../../web/js/annotation_sidebar/AnnotationMutationCallbacks");
const initialStore = {
    data: [],
    view: [],
    viewPage: [],
    selected: [],
    page: 0,
    rowsPerPage: 25,
    order: 'desc',
    orderBy: 'progress',
    filter: {
        colors: [],
        text: "",
        tags: [],
        annotationTypes: []
    },
};
function mutatorFactory(storeProvider, setStore) {
    let dataProvider = () => [];
    function doSort(data) {
        return ArrayStreams_1.arrayStream(data)
            .sort((a, b) => {
            const toTimestamp = (val) => {
                var _a, _b;
                return (_b = (_a = val.lastUpdated) !== null && _a !== void 0 ? _a : val.created) !== null && _b !== void 0 ? _b : '';
            };
            return toTimestamp(b).localeCompare(toTimestamp(a));
        })
            .collect();
    }
    function reduce(tmpStore) {
        const { data, page, rowsPerPage, filter } = tmpStore;
        const view = Mapper_1.Mappers.create(data)
            .map(current => AnnotationRepoFilters2_1.AnnotationRepoFilters2.execute(current, filter))
            .map(current => doSort(current))
            .collect();
        const viewPage = view.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        return Object.assign(Object.assign({}, tmpStore), { view, viewPage });
    }
    function doReduceAndUpdateState(tmpState) {
        setTimeout(() => {
            const newState = reduce(Object.assign({}, tmpState));
            setStore(newState);
        }, 1);
    }
    function refresh() {
        const store = storeProvider();
        setTimeout(() => {
            const data = dataProvider();
            doReduceAndUpdateState(Object.assign(Object.assign({}, store), { data }));
        }, 1);
    }
    function setDataProvider(newDataProvider) {
        dataProvider = newDataProvider;
    }
    return { doReduceAndUpdateState, refresh, setDataProvider };
}
const useCreateCallbacks = (storeProvider, setStore, mutator, dialogs, persistence, repoDocMetaLoader, repoDocMetaManager, log) => {
    const docLoader = DocLoaderHooks_1.useDocLoader();
    const annotationMutationCallbacksFactory = AnnotationMutationCallbacks_1.useAnnotationMutationCallbacksFactory();
    return React.useMemo(() => {
        function updateStore(docMetas) {
            const { persistenceLayerProvider } = persistence;
            for (const docMeta of docMetas) {
                const fingerprint = docMeta.docInfo.fingerprint;
                const repoDocMeta = RepoDocMetas_1.RepoDocMetas.convert(persistenceLayerProvider, fingerprint, docMeta);
                repoDocMetaManager.updateFromRepoDocMeta(docMeta.docInfo.fingerprint, repoDocMeta);
            }
            return docMetas;
        }
        function refresher() {
            mutator.refresh();
        }
        const annotationMutations = annotationMutationCallbacksFactory(updateStore, refresher);
        function selectedAnnotations(opts) {
            if (opts && opts.selected) {
                return opts.selected;
            }
            const store = storeProvider();
            const { selected, viewPage } = store;
            return viewPage.filter(current => selected.includes(current.id));
        }
        function doOpen(docInfo) {
            const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(Either_1.Either.ofRight(docInfo));
            const docLoadRequest = {
                fingerprint: docInfo.fingerprint,
                title: docInfo.title || 'Untitled',
                backendFileRef,
                newWindow: true,
                url: docInfo.url
            };
            docLoader(docLoadRequest);
        }
        function selectRow(selectedID, event, type) {
            const store = storeProvider();
            const selected = SelectionEvents2_1.SelectionEvents2.selectRow(selectedID, store.selected, store.viewPage, event, type);
            mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { selected }));
        }
        function onTagSelected(tags) {
            const store = storeProvider();
            mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { page: 0, selected: [], filter: Object.assign(Object.assign({}, store.filter), { tags }) }));
        }
        function setPage(page) {
            const store = storeProvider();
            mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { page, selected: [] }));
        }
        function setRowsPerPage(rowsPerPage) {
            const store = storeProvider();
            mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { rowsPerPage, page: 0, selected: [] }));
        }
        function onTagged() {
            const selected = selectedAnnotations();
            annotationMutations.onTagged({ selected });
        }
        function doUpdated(annotation) {
            const { docMeta, original } = annotation;
            function doAsync() {
                return __awaiter(this, void 0, void 0, function* () {
                    AnnotationMutations_1.AnnotationMutations.update(annotation, original);
                    yield repoDocMetaLoader.update(docMeta, 'updated');
                    const { persistenceLayerProvider } = persistence;
                    const persistenceLayer = persistenceLayerProvider();
                    yield persistenceLayer.writeDocMeta(docMeta);
                });
            }
            doAsync()
                .catch(err => log.error(err));
        }
        function doExport(format) {
            const store = storeProvider();
            ;
            function doAsync() {
                return __awaiter(this, void 0, void 0, function* () {
                    const { persistenceLayerProvider } = persistence;
                    yield Exporters_1.Exporters.doExportForAnnotations(persistenceLayerProvider, store.view, format);
                });
            }
            doAsync()
                .catch(err => log.error("Unable to download: ", err));
        }
        function onExport(format) {
            doExport(format);
        }
        function setFilter(filter) {
            const store = storeProvider();
            mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { filter: Object.assign(Object.assign({}, store.filter), filter) }));
        }
        function onDeleted() {
            const selected = selectedAnnotations();
            annotationMutations.onDeleted({ selected });
        }
        function onDragStart(event) {
        }
        function onDragEnd() {
        }
        function doDropped(annotations, tag) {
            annotationMutations.doTagged(annotations, [tag], 'add');
        }
        function onDropped(tag) {
            const selected = selectedAnnotations();
            doDropped(selected, tag);
        }
        return {
            doOpen,
            selectRow,
            onTagSelected,
            setPage,
            setRowsPerPage,
            onTagged,
            onExport,
            setFilter,
            doUpdated,
            onDeleted,
            onDragStart,
            onDragEnd,
            doDropped,
            onDropped,
            annotationMutations
        };
    }, [docLoader, annotationMutationCallbacksFactory, log, mutator,
        persistence, repoDocMetaLoader, repoDocMetaManager, storeProvider]);
};
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const persistence = PersistenceLayerApp_1.usePersistenceContext();
    const repoDocMetaLoader = PersistenceLayerApp_1.useRepoDocMetaLoader();
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const log = MUILogger_1.useLogger();
    return useCreateCallbacks(storeProvider, setStore, mutator, dialogs, persistence, repoDocMetaLoader, repoDocMetaManager, log);
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.AnnotationRepoStoreProvider = _a[0], exports.useAnnotationRepoStore = _a[1], exports.useAnnotationRepoCallbacks = _a[2], exports.useAnnotationRepoMutator = _a[3];
const AnnotationRepoStoreInner = React.memo((props) => {
    const repoDocMetaLoader = PersistenceLayerApp_1.useRepoDocMetaLoader();
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const annotationRepoMutator = exports.useAnnotationRepoMutator();
    const annotationRepoCallbacks = exports.useAnnotationRepoCallbacks();
    const doRefresh = React.useMemo(() => Debouncers_1.Debouncers.create(() => annotationRepoMutator.refresh()), [annotationRepoMutator]);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        annotationRepoMutator.setDataProvider(() => repoDocMetaManager.repoDocAnnotationIndex.values());
        doRefresh();
        repoDocMetaLoader.addEventListener(doRefresh);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        Preconditions_1.Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(doRefresh), "Failed to remove event listener");
    });
    const tagSidebarEventForwarder = React.useMemo(() => {
        return {
            onTagSelected: annotationRepoCallbacks.onTagSelected,
            onDropped: annotationRepoCallbacks.onDropped
        };
    }, [annotationRepoCallbacks]);
    return (React.createElement(TagSidebarEventForwarder_1.TagSidebarEventForwarderContext.Provider, { value: tagSidebarEventForwarder },
        React.createElement(AnnotationMutationsContext_1.AnnotationMutationsContextProvider, { value: annotationRepoCallbacks.annotationMutations }, props.children)));
});
exports.AnnotationRepoStore2 = React.memo((props) => {
    return (React.createElement(exports.AnnotationRepoStoreProvider, null,
        React.createElement(AnnotationRepoStoreInner, null,
            React.createElement(React.Fragment, null,
                props.children,
                React.createElement(AddFileDropzone_1.AddFileDropzone, null)))));
});
//# sourceMappingURL=AnnotationRepoStore.js.map