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
exports.PersistenceLayerApp = exports.useTagsProvider = exports.useRepoDocMetaManager = exports.useRepoDocMetaLoader = exports.usePrefsContext = exports.useTagDescriptorsContext = exports.useTagsContext = exports.usePersistenceLayerContext = exports.usePersistenceContext = exports.TagDescriptorsContext = exports.TagsContext = exports.PersistenceContext = exports.PersistenceLayerContext = void 0;
const react_1 = __importDefault(require("react"));
const PersistenceLayerWatcher_1 = require("./PersistenceLayerWatcher");
const UserTagsDataLoader_1 = require("./UserTagsDataLoader");
const TagDescriptors_1 = require("polar-shared/src/tags/TagDescriptors");
const RepoDataLoader_1 = require("./RepoDataLoader");
const ContextMemo_1 = require("../../../../web/js/react/ContextMemo");
const PersistenceLayerMutator_1 = require("./PersistenceLayerMutator");
const DocMetaLookupContextProvider_1 = require("../../../../web/js/annotation_sidebar/DocMetaLookupContextProvider");
const PrefsContext_1 = require("./PrefsContext");
exports.PersistenceLayerContext = ContextMemo_1.createContextMemo(null);
exports.PersistenceContext = ContextMemo_1.createContextMemo(null);
exports.TagsContext = ContextMemo_1.createContextMemo(null);
exports.TagDescriptorsContext = ContextMemo_1.createContextMemo(null);
function usePersistenceContext() {
    return ContextMemo_1.useContextMemo(exports.PersistenceContext);
}
exports.usePersistenceContext = usePersistenceContext;
function usePersistenceLayerContext() {
    return ContextMemo_1.useContextMemo(exports.PersistenceLayerContext);
}
exports.usePersistenceLayerContext = usePersistenceLayerContext;
function useTagsContext() {
    return ContextMemo_1.useContextMemo(exports.TagsContext);
}
exports.useTagsContext = useTagsContext;
function useTagDescriptorsContext() {
    return ContextMemo_1.useContextMemo(exports.TagDescriptorsContext);
}
exports.useTagDescriptorsContext = useTagDescriptorsContext;
function usePrefsContext() {
    const { persistenceLayerProvider } = usePersistenceLayerContext();
    const prefsContext = {
        get: (key) => {
            const datastore = persistenceLayerProvider().datastore;
            return datastore.getPrefs().get().get(key).getOrUndefined();
        },
        fetch: (key) => {
            const datastore = persistenceLayerProvider().datastore;
            return datastore.getPrefs().get().fetch(key);
        },
        commit: () => __awaiter(this, void 0, void 0, function* () {
            const datastore = persistenceLayerProvider().datastore;
            yield datastore.getPrefs().get().commit();
        }),
        set: (key, value) => {
            const datastore = persistenceLayerProvider().datastore;
            datastore.getPrefs().get().set(key, value);
        }
    };
    return prefsContext;
}
exports.usePrefsContext = usePrefsContext;
const RepoDocMetaLoaderContext = react_1.default.createContext(null);
const RepoDocMetaManagerContext = react_1.default.createContext(null);
const TagsProviderContext = react_1.default.createContext(() => []);
exports.useRepoDocMetaLoader = () => react_1.default.useContext(RepoDocMetaLoaderContext);
exports.useRepoDocMetaManager = () => react_1.default.useContext(RepoDocMetaManagerContext);
exports.useTagsProvider = () => react_1.default.useContext(TagsProviderContext);
exports.PersistenceLayerApp = (props) => {
    return (react_1.default.createElement(RepoDocMetaManagerContext.Provider, { value: props.repoDocMetaManager },
        react_1.default.createElement(RepoDocMetaLoaderContext.Provider, { value: props.repoDocMetaLoader },
            react_1.default.createElement(PersistenceLayerWatcher_1.PersistenceLayerWatcher, { persistenceLayerManager: props.persistenceLayerManager, render: persistenceLayerProvider => react_1.default.createElement(RepoDataLoader_1.RepoDataLoader, { repoDocMetaLoader: props.repoDocMetaLoader, repoDocMetaManager: props.repoDocMetaManager, render: (appTags) => react_1.default.createElement(UserTagsDataLoader_1.UserTagsDataLoader, { persistenceLayerProvider: persistenceLayerProvider, render: userTags => {
                            const { repoDocMetaManager } = props;
                            const docTags = () => TagDescriptors_1.TagDescriptors.merge(appTags === null || appTags === void 0 ? void 0 : appTags.docTags(), userTags);
                            const annotationTags = () => TagDescriptors_1.TagDescriptors.merge(appTags === null || appTags === void 0 ? void 0 : appTags.annotationTags(), userTags);
                            const tagsProvider = props.tagsType === 'documents' ? docTags : annotationTags;
                            const tagDescriptorsProvider = props.tagsType === 'documents' ? docTags : annotationTags;
                            const persistenceLayerMutator = new PersistenceLayerMutator_1.PersistenceLayerMutator(repoDocMetaManager, persistenceLayerProvider, tagsProvider);
                            const persistenceContext = {
                                repoDocMetaLoader: props.repoDocMetaLoader,
                                repoDocMetaManager: props.repoDocMetaManager,
                                persistenceLayerProvider,
                                tagsProvider,
                                persistenceLayerMutator,
                                persistenceLayerManager: props.persistenceLayerManager
                            };
                            const persistenceLayerContext = {
                                persistenceLayerProvider
                            };
                            const tagsContext = {
                                tagsProvider
                            };
                            const tagDescriptorsContext = {
                                tagDescriptorsProvider
                            };
                            const docRepoRenderProps = {
                                persistenceLayerProvider,
                                docTags,
                                annotationTags,
                                userTags: () => userTags || []
                            };
                            class DefaultDocMetaLookupContext extends DocMetaLookupContextProvider_1.BaseDocMetaLookupContext {
                                lookup(id) {
                                    var _a;
                                    return (_a = repoDocMetaManager.repoDocInfoIndex.get(id)) === null || _a === void 0 ? void 0 : _a.docMeta;
                                }
                            }
                            const docMetaLookupContext = new DefaultDocMetaLookupContext();
                            return (react_1.default.createElement(exports.PersistenceContext.Provider, { value: persistenceContext },
                                react_1.default.createElement(exports.PersistenceLayerContext.Provider, { value: persistenceLayerContext },
                                    react_1.default.createElement(exports.TagsContext.Provider, { value: tagsContext },
                                        react_1.default.createElement(exports.TagDescriptorsContext.Provider, { value: tagDescriptorsContext },
                                            react_1.default.createElement(TagsProviderContext.Provider, { value: tagsProvider },
                                                react_1.default.createElement(DocMetaLookupContextProvider_1.DocMetaLookupContext.Provider, { value: docMetaLookupContext },
                                                    react_1.default.createElement(PrefsContext_1.PrefsContext, null, props.render(docRepoRenderProps)))))))));
                        } }) }) }))));
};
//# sourceMappingURL=PersistenceLayerApp.js.map