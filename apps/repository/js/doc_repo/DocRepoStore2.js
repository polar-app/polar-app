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
exports.DocRepoStore2 = exports.useDocRepoMutator = exports.useDocRepoCallbacks = exports.useDocRepoStore = exports.DocRepoStoreProvider = void 0;
const React = __importStar(require("react"));
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const Sorting_1 = require("./Sorting");
const DocRepoFilters2_1 = require("./DocRepoFilters2");
const Functions_1 = require("polar-shared/src/util/Functions");
const Tags_1 = require("polar-shared/src/tags/Tags");
const Mapper_1 = require("polar-shared/src/util/Mapper");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const PersistenceLayerApp_1 = require("../persistence_layer/PersistenceLayerApp");
const ReactLifecycleHooks_1 = require("../../../../web/js/hooks/ReactLifecycleHooks");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Debouncers_1 = require("polar-shared/src/util/Debouncers");
const BackendFileRefs_1 = require("../../../../web/js/datastore/BackendFileRefs");
const Either_1 = require("../../../../web/js/util/Either");
const Clipboards_1 = require("../../../../web/js/util/system/clipboard/Clipboards");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const TagSidebarEventForwarder_1 = require("../store/TagSidebarEventForwarder");
const SelectionEvents2_1 = require("./SelectionEvents2");
const TaggedCallbacks_1 = require("../annotation_repo/TaggedCallbacks");
const BatchMutators_1 = require("../BatchMutators");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const AddFileDropzone_1 = require("../../../../web/js/apps/repository/upload/AddFileDropzone");
const DocLoaderHooks_1 = require("../../../../web/js/apps/main/DocLoaderHooks");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const ReactHooks_1 = require("../../../../web/js/hooks/ReactHooks");
const RepoDocInfos_1 = require("../RepoDocInfos");
const initialStore = {
    data: [],
    view: [],
    selected: [],
    orderBy: 'progress',
    order: 'desc',
    filters: {},
    _refresh: 0
};
function mutatorFactory(storeProvider, setStore) {
    let dataProvider = () => [];
    function reduce(tmpStore) {
        const { data, order, orderBy, filters } = tmpStore;
        const view = Mapper_1.Mappers.create(data)
            .map(current => DocRepoFilters2_1.DocRepoFilters2.execute(current, filters))
            .map(current => Sorting_1.Sorting.stableSort(current, Sorting_1.Sorting.getComparator(order, orderBy)))
            .collect();
        return Object.assign(Object.assign({}, tmpStore), { view });
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
    return {
        doReduceAndUpdateState,
        refresh,
        setDataProvider
    };
}
function useCreateCallbacks(storeProvider, setStore, mutator, repoDocMetaManager, tagsProvider, dialogs, persistence, log) {
    const docLoader = DocLoaderHooks_1.useDocLoader();
    function firstSelected() {
        const selected = selectedProvider();
        return selected.length >= 1 ? selected[0] : undefined;
    }
    function copyText(text, message) {
        Clipboards_1.Clipboards.getInstance().writeText(text);
        if (message) {
            dialogs.snackbar({ message });
        }
    }
    function withBatch(transactions, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            mutator.refresh();
            yield BatchMutators_1.BatchMutators.exec(transactions, Object.assign(Object.assign({}, opts), { refresh: mutator.refresh, dialogs }));
        });
    }
    function selectRow(viewID, event, type) {
        const store = storeProvider();
        const selected = SelectionEvents2_1.SelectionEvents2.selectRow(viewID, store.selected, store.view, event, type);
        setStore(Object.assign(Object.assign({}, store), { selected: selected || [] }));
    }
    function selectedProvider() {
        const store = storeProvider();
        const { view, selected } = store;
        return view.filter(current => selected.includes(current.id));
    }
    function setSelected(newSelected) {
        const store = storeProvider();
        const { view } = store;
        function computeSelected() {
            if (newSelected === 'all') {
                return view.map(current => current.id);
            }
            if (newSelected === 'none') {
                return [];
            }
            return newSelected;
        }
        const selected = computeSelected();
        setStore(Object.assign(Object.assign({}, store), { selected }));
    }
    function setFilters(filters) {
        const store = storeProvider();
        mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { filters, selected: [] }));
    }
    function setSort(order, orderBy) {
        const store = storeProvider();
        mutator.doReduceAndUpdateState(Object.assign(Object.assign({}, store), { order,
            orderBy, selected: [] }));
    }
    function doTagged(repoDocInfos, tags, strategy = 'set') {
        function toAsyncTransaction(repoDocInfo) {
            const newTags = Tags_1.Tags.computeNewTags(repoDocInfo.tags, tags, strategy);
            return repoDocMetaManager.writeDocInfoTags(repoDocInfo, newTags);
        }
        withBatch(repoDocInfos.map(toAsyncTransaction))
            .catch(err => log.error(err));
    }
    function doArchived(repoDocInfos, archived) {
        const toAsyncTransaction = (repoDocInfo) => {
            function prepare() {
                repoDocInfo.archived = archived;
                repoDocInfo.docInfo.archived = archived;
            }
            function commit() {
                return repoDocMetaManager.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
            }
            return { prepare, commit };
        };
        function doHandle() {
            return __awaiter(this, void 0, void 0, function* () {
                yield withBatch(repoDocInfos.map(toAsyncTransaction));
            });
        }
        doHandle()
            .catch(err => log.error(err));
    }
    function doFlagged(repoDocInfos, flagged) {
        const toAsyncTransaction = (repoDocInfo) => {
            function prepare() {
                repoDocInfo.flagged = flagged;
                repoDocInfo.docInfo.flagged = flagged;
            }
            function commit() {
                return repoDocMetaManager.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
            }
            return { prepare, commit };
        };
        function doHandle() {
            return __awaiter(this, void 0, void 0, function* () {
                yield withBatch(repoDocInfos.map(toAsyncTransaction));
            });
        }
        doHandle()
            .catch(err => log.error(err));
    }
    function onUpdated(repoDocInfo, docInfo) {
        const toAsyncTransaction = (repoDocInfo) => {
            function prepare() {
                const docMeta = repoDocInfo.docMeta;
                docMeta.docInfo = docInfo;
                const newRepoDocInfo = RepoDocInfos_1.RepoDocInfos.convert(docMeta);
                repoDocMetaManager.updateFromRepoDocInfo(repoDocInfo.fingerprint, newRepoDocInfo);
            }
            function commit() {
                repoDocInfo.docMeta.docInfo = docInfo;
                return repoDocMetaManager.writeDocInfo(docInfo, repoDocInfo.docMeta);
            }
            return { prepare, commit };
        };
        function doHandle() {
            return __awaiter(this, void 0, void 0, function* () {
                yield withBatch([repoDocInfo].map(toAsyncTransaction));
            });
        }
        doHandle()
            .catch(err => log.error(err));
    }
    function doCopyDocumentID(repoDocInfo) {
        const text = repoDocInfo.fingerprint;
        copyText(text, "Document ID copied to clipboard");
    }
    function doCopyOriginalURL(repoDocInfo) {
        function toText() {
            return repoDocInfo.url;
        }
        const text = toText();
        copyText(text, "URL copied to clipboard");
    }
    function doDeleted(repoDocInfos) {
        function doDeleteBatch() {
            const toAsyncTransaction = (repoDocInfo) => {
                function prepare() {
                }
                function commit() {
                    return repoDocMetaManager.deleteDocInfo(repoDocInfo);
                }
                return { prepare, commit };
            };
            const success = `${repoDocInfos.length} documents deleted.`;
            const error = `Failed to delete document: `;
            function doHandle() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield withBatch(repoDocInfos.map(toAsyncTransaction), { success, error });
                });
            }
            doHandle()
                .catch(err => log.error(err));
        }
        setSelected([]);
        doDeleteBatch();
        setSelected([]);
    }
    function doDropped(repoDocInfos, tag) {
        doTagged(repoDocInfos, [tag], 'add');
    }
    function doOpen(repoDocInfo) {
        const fingerprint = repoDocInfo.fingerprint;
        const docInfo = repoDocInfo.docInfo;
        const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(Either_1.Either.ofRight(docInfo));
        const docLoadRequest = {
            fingerprint,
            title: repoDocInfo.title,
            url: repoDocInfo.url,
            backendFileRef,
            newWindow: true
        };
        docLoader(docLoadRequest);
    }
    function doRename(repoDocInfo, title) {
        function doHandle() {
            return __awaiter(this, void 0, void 0, function* () {
                mutator.refresh();
                yield repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title);
            });
        }
        doHandle()
            .catch(err => log.error("Could not write doc title: ", err));
    }
    function onArchived() {
        const repoDocInfos = selectedProvider();
        if (repoDocInfos.length === 0) {
            return;
        }
        function computeNewArchived() {
            if (repoDocInfos.length === 1) {
                return !repoDocInfos[0].archived;
            }
            const nrArchived = ArrayStreams_1.arrayStream(repoDocInfos)
                .filter(current => current.archived)
                .collect()
                .length;
            if (nrArchived === repoDocInfos.length) {
                return false;
            }
            else {
                return true;
            }
        }
        const newArchived = computeNewArchived();
        if (newArchived) {
            dialogs.confirm({
                title: "Are you sure you want to archive these document(s)?",
                subtitle: "They won't be deleted but will be hidden by default.",
                onCancel: Functions_1.NULL_FUNCTION,
                type: 'warning',
                onAccept: () => doArchived(repoDocInfos, newArchived),
            });
        }
        else {
            doArchived(repoDocInfos, newArchived);
        }
    }
    function onCopyDocumentID() {
        Optional_1.Optional.of(firstSelected()).map(doCopyDocumentID);
    }
    function onCopyOriginalURL() {
        Optional_1.Optional.of(firstSelected()).map(doCopyOriginalURL);
    }
    function onFlagged() {
        const repoDocInfos = selectedProvider();
        if (repoDocInfos.length === 0) {
            return;
        }
        if (repoDocInfos.length === 1) {
            const repoDocInfo = repoDocInfos[0];
            doFlagged(repoDocInfos, !repoDocInfo.flagged);
            return;
        }
        dialogs.confirm({
            title: "Are you sure you want to flag these document(s)?",
            subtitle: "Flagging will allow these documents to stand out and prioritized among your other documents.",
            onCancel: Functions_1.NULL_FUNCTION,
            type: 'warning',
            onAccept: () => doFlagged(repoDocInfos, true),
        });
    }
    function onOpen() {
        doOpen(firstSelected());
    }
    function onTagSelected(tags) {
        const store = storeProvider();
        setFilters(Object.assign(Object.assign({}, store.filters), { tags }));
    }
    function onDragStart(event) {
        console.log("onDragStart");
        const configureDragImage = () => {
            const src = document.createElement("div");
            event.dataTransfer.setDragImage(src, 0, 0);
        };
        configureDragImage();
    }
    function onDragEnd() {
    }
    function onDropped(tag) {
        const selected = selectedProvider();
        doDropped(selected, tag);
    }
    function onRename() {
        const repoDocInfo = firstSelected();
        if (!repoDocInfo) {
            console.log("No docs selected");
            return;
        }
        dialogs.prompt({
            title: "Enter a new title for the document:",
            defaultValue: repoDocInfo.title,
            onCancel: Functions_1.NULL_FUNCTION,
            onDone: (value) => doRename(repoDocInfo, value)
        });
    }
    function onDeleted() {
        const repoDocInfos = selectedProvider();
        if (repoDocInfos.length === 0) {
            return;
        }
        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'danger',
            onAccept: () => doDeleted(repoDocInfos),
        });
    }
    function onTagged() {
        const { relatedTagsManager } = repoDocMetaManager;
        const relatedOptionsCalculator = relatedTagsManager.toRelatedOptionsCalculator();
        const opts = {
            targets: selectedProvider,
            tagsProvider: () => tagsProvider(),
            dialogs,
            doTagged,
            relatedOptionsCalculator
        };
        const callback = TaggedCallbacks_1.TaggedCallbacks.create(opts);
        callback();
    }
    return {
        selectedProvider,
        selectRow,
        setSelected,
        setFilters,
        setSort,
        doTagged,
        doOpen,
        doRename,
        doCopyOriginalURL,
        doCopyDocumentID,
        doDeleted,
        doArchived,
        doFlagged,
        onUpdated,
        doDropped,
        onTagged,
        onOpen,
        onRename,
        onCopyOriginalURL,
        onCopyDocumentID,
        onDeleted,
        onArchived,
        onFlagged,
        onDragStart,
        onDragEnd,
        onDropped,
        onTagSelected,
    };
}
const useCallbacksFactory = (storeProvider, setStore, mutator) => {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const tagsProvider = PersistenceLayerApp_1.useTagsProvider();
    const persistence = PersistenceLayerApp_1.usePersistenceContext();
    const log = MUILogger_1.useLogger();
    const tagsProviderRef = ReactHooks_1.useRefWithUpdates(tagsProvider);
    return useCreateCallbacks(storeProvider, setStore, mutator, repoDocMetaManager, () => tagsProviderRef.current(), dialogs, persistence, log);
};
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.DocRepoStoreProvider = _a[0], exports.useDocRepoStore = _a[1], exports.useDocRepoCallbacks = _a[2], exports.useDocRepoMutator = _a[3];
const DocRepoStoreLoader = React.memo((props) => {
    const repoDocMetaLoader = PersistenceLayerApp_1.useRepoDocMetaLoader();
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const docRepoMutator = exports.useDocRepoMutator();
    const callbacks = exports.useDocRepoCallbacks();
    const doRefresh = React.useMemo(() => Debouncers_1.Debouncers.create(() => docRepoMutator.refresh()), [docRepoMutator]);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        docRepoMutator.setDataProvider(() => repoDocMetaManager.repoDocInfoIndex.values());
        doRefresh();
        repoDocMetaLoader.addEventListener(doRefresh);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        Preconditions_1.Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(doRefresh), "Failed to remove event listener");
    });
    const tagSidebarEventForwarder = React.useMemo(() => {
        return {
            onTagSelected: callbacks.onTagSelected,
            onDropped: callbacks.onDropped
        };
    }, [callbacks]);
    return (React.createElement(TagSidebarEventForwarder_1.TagSidebarEventForwarderContext.Provider, { value: tagSidebarEventForwarder }, props.children));
});
exports.DocRepoStore2 = React.memo((props) => {
    return (React.createElement(exports.DocRepoStoreProvider, null,
        React.createElement(DocRepoStoreLoader, null,
            React.createElement(React.Fragment, null,
                props.children,
                React.createElement(AddFileDropzone_1.AddFileDropzone, null)))));
});
//# sourceMappingURL=DocRepoStore2.js.map