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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFolderSidebarCallbacks = exports.useFolderSidebarStore = exports.FolderSidebarCallbacksContext = exports.FolderSidebarStoreContext = exports.createFolderSidebarStore = void 0;
const react_1 = __importStar(require("react"));
const Tags_1 = require("polar-shared/src/tags/Tags");
const ObservableStore_1 = require("../../../../web/js/react/store/ObservableStore");
const TagNodes_1 = require("../../../../web/js/tags/TagNodes");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const PersistenceLayerApp_1 = require("../persistence_layer/PersistenceLayerApp");
const TagSidebarEventForwarder_1 = require("../store/TagSidebarEventForwarder");
const FolderSelectionEvents_1 = require("./FolderSelectionEvents");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const Paths_1 = require("polar-shared/src/util/Paths");
const PersistenceLayerMutator_1 = require("../persistence_layer/PersistenceLayerMutator");
const BatchMutators_1 = require("../BatchMutators");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const initialStore = {
    filter: "",
    tags: [],
    tagsView: [],
    foldersRoot: undefined,
    selected: [],
    expanded: []
};
function mutatorFactory(storeProvider, setStore) {
    function reduce(mutation) {
        const store = storeProvider();
        function computeFiltered(tags) {
            const filterPredicate = (tag) => {
                return tag.label.toLowerCase().indexOf(mutation.filter) !== -1;
            };
            if (mutation.filter.trim() !== '') {
                return tags.filter(filterPredicate);
            }
            return tags;
        }
        function rebuildStore(tags) {
            const filtered = computeFiltered(tags);
            const tagsView = Tags_1.Tags.onlyRegular(filtered);
            function buildFoldersRoot() {
                function toTagDescriptorSelected(tag) {
                    return Object.assign(Object.assign({}, tag), { selected: mutation.selected.includes(tag.id) });
                }
                const rawFoldersRoot = TagNodes_1.TagNodes.createFoldersRoot({ tags: filtered, type: 'folder' });
                return TagNodes_1.TagNodes.decorate(rawFoldersRoot, toTagDescriptorSelected);
            }
            const foldersRoot = buildFoldersRoot();
            return Object.assign(Object.assign({}, store), { filter: mutation.filter, selected: mutation.selected, tags,
                tagsView,
                foldersRoot });
        }
        function hasChanged() {
            if (store.foldersRoot === undefined) {
                return true;
            }
            if (!react_fast_compare_1.default(store.tags, tags)) {
                return true;
            }
            if (!react_fast_compare_1.default(store.selected, mutation.selected)) {
                return true;
            }
            if (store.filter.trim() !== mutation.filter.trim()) {
                return true;
            }
            return false;
        }
        const tags = [...mutation.tags].sort((a, b) => b.count - a.count);
        if (hasChanged()) {
            return rebuildStore(tags);
        }
        return undefined;
    }
    function doUpdate(mutation) {
        const newStore = reduce(mutation);
        if (newStore) {
            setStore(newStore);
        }
    }
    function refresh() {
        const store = storeProvider();
        doUpdate(store);
    }
    return { doUpdate, refresh };
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const tagDescriptorsContext = PersistenceLayerApp_1.useTagDescriptorsContext();
    const tagSidebarEventForwarder = TagSidebarEventForwarder_1.useTagSidebarEventForwarder();
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const persistence = PersistenceLayerApp_1.usePersistenceContext();
    const log = MUILogger_1.useLogger();
    const persistenceLayerMutator = react_1.default.useMemo(() => {
        return new PersistenceLayerMutator_1.PersistenceLayerMutator(repoDocMetaManager, persistence.persistenceLayerProvider, tagDescriptorsContext.tagDescriptorsProvider);
    }, [repoDocMetaManager, persistence, tagDescriptorsContext]);
    function doHookUpdate() {
        const store = storeProvider();
        const tags = (tagDescriptorsContext === null || tagDescriptorsContext === void 0 ? void 0 : tagDescriptorsContext.tagDescriptorsProvider()) || [];
        mutator.doUpdate(Object.assign(Object.assign({}, store), { tags }));
    }
    doHookUpdate();
    return react_1.default.useMemo(() => {
        function doSelectRow(nodes) {
            const store = storeProvider();
            const selectedTags = Tags_1.Tags.lookupByTagLiteral(store.tags, nodes, Tags_1.Tags.create);
            tagSidebarEventForwarder.onTagSelected(selectedTags);
        }
        function selectRow(node, event, source) {
            const store = storeProvider();
            function toSelected() {
                if (store.selected.length > 1) {
                    return 'multiple';
                }
                else if (store.selected.length === 1) {
                    return 'single';
                }
                else {
                    return 'none';
                }
            }
            function toSelfSelected() {
                return store.selected.includes(node) ? 'yes' : 'no';
            }
            const eventType = FolderSelectionEvents_1.FolderSelectionEvents.toEventType(event, source);
            const selected = toSelected();
            const selfSelected = toSelfSelected();
            const strategy = FolderSelectionEvents_1.FolderSelectionEvents.toStrategy({ eventType, selected, selfSelected });
            const newSelected = FolderSelectionEvents_1.FolderSelectionEvents.executeStrategy(strategy, node, store.selected);
            mutator.doUpdate(Object.assign(Object.assign({}, store), { selected: newSelected }));
            doSelectRow(newSelected);
        }
        function toggleExpanded(nodes) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { expanded: nodes }));
        }
        function collapseNode(node) {
            const store = storeProvider();
            const expanded = [...store.expanded]
                .filter(current => current !== node);
            setStore(Object.assign(Object.assign({}, store), { expanded }));
        }
        function expandNode(node) {
            const store = storeProvider();
            const expanded = [...store.expanded];
            if (!expanded.includes(node)) {
                expanded.push(node);
            }
            setStore(Object.assign(Object.assign({}, store), { expanded }));
        }
        function setFilter(filter) {
            const store = storeProvider();
            mutator.doUpdate(Object.assign(Object.assign({}, store), { filter, selected: [] }));
        }
        function doCreateUserTag(userTag, type) {
            const createNewTag = () => {
                const store = storeProvider();
                const selectedTags = store.selected;
                switch (type) {
                    case "tag":
                        return userTag;
                    case "folder":
                        const parent = selectedTags.length > 0 ? selectedTags[0] : '/';
                        return Paths_1.Paths.create(parent, userTag);
                }
            };
            const newTag = createNewTag();
            function doHandle() {
                return __awaiter(this, void 0, void 0, function* () {
                    const { persistenceLayerMutator } = persistence;
                    yield persistenceLayerMutator.createTag(newTag);
                    dialogs.snackbar({ message: `Tag '${newTag}' created successfully.` });
                });
            }
            doHandle()
                .catch(err => log.error("Unable to create tag: " + newTag, err));
        }
        function onCreateUserTag(type) {
            dialogs.prompt({
                title: "Create new " + type,
                description: "May not create spaces and some extended unicode characters.",
                autoFocus: true,
                onCancel: Functions_1.NULL_FUNCTION,
                onDone: (text) => doCreateUserTag(text, type)
            });
        }
        function onDrop(tagID) {
            console.log("Handling folder drop for: " + tagID);
            const store = storeProvider();
            const selectedTags = Tags_1.Tags.lookupByTagLiteral(store.tags, [tagID], Tags_1.Tags.create);
            const selectedTag = selectedTags[0];
            tagSidebarEventForwarder.onDropped(selectedTag);
        }
        function selectedTags() {
            const store = storeProvider();
            const tagsMap = Tags_1.Tags.toMap(store.tags);
            return store.selected.map(current => tagsMap[current])
                .filter(current => Preconditions_1.isPresent(current));
        }
        function withBatch(transactions, opts = {}) {
            return __awaiter(this, void 0, void 0, function* () {
                yield BatchMutators_1.BatchMutators.exec(transactions, Object.assign(Object.assign({}, opts), { refresh: mutator.refresh, dialogs }));
            });
        }
        function doDelete(selected) {
            function toAsyncTransaction(tag) {
                Preconditions_1.Preconditions.assertPresent(tag, 'tag');
                const deleteTagTransaction = persistenceLayerMutator.deleteTag(tag.id);
                function prepare() {
                    deleteTagTransaction.prepare();
                    const store = storeProvider();
                    const tags = store.tags.filter(current => current.id !== tag.id);
                    mutator.doUpdate(Object.assign(Object.assign({}, store), { tags, selected: [] }));
                }
                function commit() {
                    return deleteTagTransaction.commit();
                }
                return { prepare, commit };
            }
            const transactions = selected.map(toAsyncTransaction);
            withBatch(transactions, { error: "Unable to delete tag: " })
                .catch(err => log.error(err));
        }
        function onDelete() {
            const selected = selectedTags();
            dialogs.confirm({
                title: `Are you sure you want to delete these tags/folders?`,
                subtitle: react_1.default.createElement("div", null,
                    react_1.default.createElement("p", null, "This is a permanent operation and can't be undone.")),
                onCancel: Functions_1.NULL_FUNCTION,
                type: 'danger',
                onAccept: () => doDelete(selected)
            });
        }
        return {
            toggleExpanded,
            collapseNode,
            expandNode,
            setFilter,
            selectRow,
            onCreateUserTag,
            onDrop,
            onDelete,
        };
    }, [
        tagSidebarEventForwarder,
        dialogs,
        persistence,
        log,
        mutator,
        persistenceLayerMutator,
        storeProvider,
        setStore
    ]);
}
function createFolderSidebarStore() {
    return ObservableStore_1.createObservableStore({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });
}
exports.createFolderSidebarStore = createFolderSidebarStore;
exports.FolderSidebarStoreContext = react_1.default.createContext(null);
exports.FolderSidebarCallbacksContext = react_1.default.createContext(null);
function useFolderSidebarStore(keys) {
    const delegate = react_1.useContext(exports.FolderSidebarStoreContext);
    return delegate(keys);
}
exports.useFolderSidebarStore = useFolderSidebarStore;
function useFolderSidebarCallbacks() {
    const delegate = react_1.useContext(exports.FolderSidebarCallbacksContext);
    return delegate();
}
exports.useFolderSidebarCallbacks = useFolderSidebarCallbacks;
//# sourceMappingURL=FolderSidebarStore.js.map