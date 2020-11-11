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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerStore = exports.useDocViewerMutator = exports.useDocViewerCallbacks = exports.useDocViewerStore = exports.DocViewerStoreProviderDelegate = void 0;
const react_1 = __importDefault(require("react"));
const ObservableStore_1 = require("../../../web/js/react/store/ObservableStore");
const DocMetaRef_1 = require("../../../web/js/datastore/DocMetaRef");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const PersistenceLayerApp_1 = require("../../repository/js/persistence_layer/PersistenceLayerApp");
const AnnotationSidebarStore_1 = require("./AnnotationSidebarStore");
const DocMetaContextProvider_1 = require("../../../web/js/annotation_sidebar/DocMetaContextProvider");
const AnnotationMutationsContext_1 = require("../../../web/js/annotation_sidebar/AnnotationMutationsContext");
const Functions_1 = require("polar-shared/src/util/Functions");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const Pagemarks_1 = require("../../../web/js/metadata/Pagemarks");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ScaleLevels_1 = require("./ScaleLevels");
const MUILogger_1 = require("../../../web/js/mui/MUILogger");
const DocViewerSnapshots_1 = require("./DocViewerSnapshots");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const FluidPagemarkFactory_1 = require("./FluidPagemarkFactory");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const TaggedCallbacks_1 = require("../../repository/js/annotation_repo/TaggedCallbacks");
const Tags_1 = require("polar-shared/src/tags/Tags");
const MUIDialogControllers_1 = require("../../../web/js/mui/dialogs/MUIDialogControllers");
const LocalRelatedTagsStore_1 = require("../../../web/js/tags/related/LocalRelatedTagsStore");
const RelatedTagsManager_1 = require("../../../web/js/tags/related/RelatedTagsManager");
const DocMetas_1 = require("../../../web/js/metadata/DocMetas");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
var computeNextZoomLevel = ScaleLevels_1.PDFScales.computeNextZoomLevel;
const AnnotationMutationCallbacks_1 = require("../../../web/js/annotation_sidebar/AnnotationMutationCallbacks");
const UUIDs_1 = require("../../../web/js/metadata/UUIDs");
const initialStore = {
    page: 1,
    docLoaded: false,
    pendingWrites: 0,
    fluidPagemarkFactory: new FluidPagemarkFactory_1.NullFluidPagemarkFactory()
};
function mutatorFactory(storeProvider, setStore) {
    function reduce() {
        return undefined;
    }
    return {};
}
function useCallbacksFactory(storeProvider, setStore, mutator) {
    const log = MUILogger_1.useLogger();
    const docMetaContext = DocMetaContextProvider_1.useDocMetaContext();
    const persistenceLayerContext = PersistenceLayerApp_1.usePersistenceLayerContext();
    const annotationSidebarCallbacks = AnnotationSidebarStore_1.useAnnotationSidebarCallbacks();
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const annotationMutationCallbacksFactory = AnnotationMutationCallbacks_1.useAnnotationMutationCallbacksFactory();
    return react_1.default.useMemo(() => {
        function writeUpdatedDocMetas(updatedDocMetas) {
            return __awaiter(this, void 0, void 0, function* () {
                function mutatePendingWrites(delta) {
                    const store = storeProvider();
                    const pendingWrites = store.pendingWrites + delta;
                    const hasPendingWrites = pendingWrites > 0;
                    setStore(Object.assign(Object.assign({}, store), { pendingWrites, hasPendingWrites }));
                }
                try {
                    mutatePendingWrites(1);
                    yield annotationMutations.writeUpdatedDocMetas(updatedDocMetas);
                }
                finally {
                    mutatePendingWrites(-1);
                }
            });
        }
        function updateDocMeta(docMeta) {
            const updated = DocMetas_1.DocMetas.updated(docMeta);
            setDocMeta(updated, true, 'update');
            return updated;
        }
        function setDocMeta(docMeta, hasPendingWrites, type) {
            var _a, _b, _c, _d;
            Preconditions_1.Preconditions.assertPresent(docMeta, 'docMeta');
            function doSetStoreAndUpdate(docMeta) {
                const store = storeProvider();
                const computeDocURL = () => {
                    if (docMeta) {
                        const docMetaFileRef = DocMetaRef_1.DocMetaFileRefs.createFromDocMeta(docMeta);
                        const persistenceLayer = persistenceLayerContext.persistenceLayerProvider();
                        if (docMetaFileRef.docFile) {
                            const file = persistenceLayer.getFile(Backend_1.Backend.STASH, docMetaFileRef.docFile);
                            return file.url;
                        }
                    }
                    return undefined;
                };
                const docURL = store.docURL || computeDocURL();
                setStore(Object.assign(Object.assign({}, store), { docMeta, docURL, hasPendingWrites }));
            }
            const store = storeProvider();
            const docViewerSnapshotUpdate = DocViewerSnapshots_1.DocViewerSnapshots.computeUpdateType3((_b = (_a = store.docMeta) === null || _a === void 0 ? void 0 : _a.docInfo) === null || _b === void 0 ? void 0 : _b.uuid, docMeta.docInfo.uuid);
            console.log(`DOC_WRITE: Update for docMeta was ${docViewerSnapshotUpdate.type} for type=${type}, cmp=${docViewerSnapshotUpdate.cmp}: \n    curr=${UUIDs_1.UUIDs.format((_d = (_c = store.docMeta) === null || _c === void 0 ? void 0 : _c.docInfo) === null || _d === void 0 ? void 0 : _d.uuid)} \n    next=${UUIDs_1.UUIDs.format(docMeta.docInfo.uuid)}`);
            if (['snapshot-local', 'snapshot-server'].includes(type) && docViewerSnapshotUpdate.type === 'self') {
                if (type === 'snapshot-server') {
                    setStore(Object.assign(Object.assign({}, store), { hasPendingWrites: false }));
                }
                console.log(`DOC_WRITE: Skipping update (type=${type}, update type: ${docViewerSnapshotUpdate.type})`);
                return;
            }
            if (docViewerSnapshotUpdate.type === 'stale') {
                console.log("DOC_WRITE: Skipping update (stale)");
                return;
            }
            function cloneDocMetaAndUpdate() {
                docMeta = DocMetas_1.DocMetas.copyOf(docMeta);
                doSetStoreAndUpdate(docMeta);
                docMetaContext.setDoc({ docMeta, mutable: true });
                annotationSidebarCallbacks.setDocMeta(docMeta);
            }
            cloneDocMetaAndUpdate();
        }
        function setDocDescriptor(docDescriptor) {
            const store = storeProvider();
            if (react_fast_compare_1.default(store.docDescriptor, docDescriptor)) {
                return;
            }
            setStore(Object.assign(Object.assign({}, store), { docDescriptor }));
        }
        function setDocScale(docScale) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { docScale }));
        }
        function setDocLoaded(docLoaded) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { docLoaded }));
        }
        function setResizer(resizer) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { resizer }));
        }
        function setScaleLeveler(scaleLeveler) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { scaleLeveler }));
        }
        function setScale(scaleLevel) {
            const store = storeProvider();
            const { scaleLeveler } = store;
            if (scaleLeveler) {
                const scaleValue = scaleLeveler(scaleLevel);
                const docScale = {
                    scale: scaleLevel,
                    scaleValue,
                };
                setDocScale(docScale);
            }
        }
        function doZoom(delta) {
            const { docScale, scaleLeveler } = storeProvider();
            if (!scaleLeveler) {
                return;
            }
            const nextScale = computeNextZoomLevel(delta, docScale === null || docScale === void 0 ? void 0 : docScale.scaleValue);
            if (nextScale) {
                setScale(nextScale);
            }
        }
        function doZoomRestore() {
            const { scaleLeveler } = storeProvider();
            if (!scaleLeveler) {
                return;
            }
            setScale(ScaleLevels_1.SCALE_VALUE_PAGE_WIDTH);
        }
        function setFluidPagemarkFactory(fluidPagemarkFactory) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { fluidPagemarkFactory }));
        }
        const annotationMutations = annotationMutationCallbacksFactory(updateStore, Functions_1.NULL_FUNCTION);
        function updateStore(docMetas) {
            return docMetas.map(docMeta => updateDocMeta(docMeta));
        }
        function onPagemark(mutation) {
            function updatePagemarkRange(pagemark, range, direction, existing) {
                const store = storeProvider();
                const fluidPagemark = store.fluidPagemarkFactory.create({ range, direction, existing });
                pagemark.range = fluidPagemark === null || fluidPagemark === void 0 ? void 0 : fluidPagemark.range;
            }
            function createPagemarkToPoint(opts, start) {
                const store = storeProvider();
                const { docMeta } = store;
                if (!docMeta) {
                    return [];
                }
                const { pageNum } = opts;
                const verticalOffsetWithinPageElement = opts.y;
                const pageHeight = opts.height;
                const percentage = Percentages_1.Percentages.calculate(verticalOffsetWithinPageElement, pageHeight, { noRound: true });
                console.log("Created pagemark with percentage: ", percentage);
                function deletePagemarkForCurrentPage(pageNum) {
                    Preconditions_1.Preconditions.assertNumber(pageNum, "pageNum");
                    Pagemarks_1.Pagemarks.deletePagemark(docMeta, pageNum);
                }
                function createPagemarksForRange(endPageNum, percentage) {
                    const createdPagemarks = Pagemarks_1.Pagemarks.updatePagemarksForRange(docMeta, endPageNum, percentage, { start });
                    if (createdPagemarks.length > 0) {
                        const last = Arrays_1.Arrays.last(createdPagemarks);
                        const fluidPagemark = store.fluidPagemarkFactory.create({ range: opts.range, direction: undefined, existing: undefined });
                        last.pagemark.range = fluidPagemark === null || fluidPagemark === void 0 ? void 0 : fluidPagemark.range;
                        updatePagemarkRange(last.pagemark, opts.range, undefined, undefined);
                    }
                    return createdPagemarks;
                }
                deletePagemarkForCurrentPage(pageNum);
                const createdPagemarks = createPagemarksForRange(pageNum, percentage);
                writeUpdatedDocMetas([docMeta])
                    .catch(err => log.error(err));
                return createdPagemarks;
            }
            function createPagemarkFromPage(opts) {
                const createOpts = Object.assign(Object.assign({}, opts), { type: 'create-to-point', range: opts.range });
                return createPagemarkToPoint(createOpts, opts.fromPage);
            }
            function updatePagemark(mutation) {
                const store = storeProvider();
                const docMeta = store.docMeta;
                function createPagemark() {
                    const newPagemark = Object.assign({}, mutation.existing);
                    newPagemark.percentage = mutation.percentage;
                    newPagemark.rect = mutation.rect;
                    return newPagemark;
                }
                const pagemark = createPagemark();
                updatePagemarkRange(pagemark, mutation.range, mutation.direction, mutation.existing);
                Pagemarks_1.Pagemarks.updatePagemark(docMeta, mutation.pageNum, pagemark);
                updateDocMeta(docMeta);
                writeUpdatedDocMetas([docMeta])
                    .catch(err => log.error(err));
                return [{ pageNum: mutation.pageNum, pagemark }];
            }
            function deletePagemark(mutation) {
                const store = storeProvider();
                const docMeta = store.docMeta;
                const { pageNum, pagemark } = mutation;
                Pagemarks_1.Pagemarks.deletePagemark(docMeta, pageNum, pagemark.id);
                updateDocMeta(docMeta);
                writeUpdatedDocMetas([docMeta])
                    .catch(err => log.error(err));
            }
            function updatePagemarkMode(mutation) {
                const store = storeProvider();
                const docMeta = store.docMeta;
                const { pageNum, existing } = mutation;
                existing.mode = mutation.mode;
                Pagemarks_1.Pagemarks.updatePagemark(docMeta, pageNum, existing);
                updateDocMeta(docMeta);
                writeUpdatedDocMetas([docMeta])
                    .catch(err => log.error(err));
                return [];
            }
            function createPagemarksForEntireDocument() {
                const store = storeProvider();
                const docMeta = store.docMeta;
                function toPagemarksForPage(pageNum) {
                    const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
                    const pagemarks = Object.values(pageMeta.pagemarks || {});
                    return { pageNum, pagemarks };
                }
                function computePagemarksForPageMapping() {
                    const pageNumbers = Numbers_1.Numbers.range(1, docMeta.docInfo.nrPages);
                    return pageNumbers.map(toPagemarksForPage);
                }
                const pagemarksForPageMapping = computePagemarksForPageMapping();
                const pagemarkBlocks = ArrayStreams_1.arrayStream(pagemarksForPageMapping)
                    .merge((a, b) => a.pagemarks.length === 0 && b.pagemarks.length === 0)
                    .collect();
                const batch = Hashcodes_1.Hashcodes.createRandomID();
                for (const pagemarkBlock of pagemarkBlocks) {
                    if (pagemarkBlock.length > 0) {
                        const start = Arrays_1.Arrays.first(pagemarkBlock).pageNum;
                        const end = Arrays_1.Arrays.last(pagemarkBlock).pageNum;
                        Pagemarks_1.Pagemarks.updatePagemarksForRange(docMeta, end, 100, { start, batch });
                    }
                }
                updateDocMeta(docMeta);
                writeUpdatedDocMetas([docMeta])
                    .catch(err => log.error(err));
                return [];
            }
            switch (mutation.type) {
                case "create-to-point":
                    return createPagemarkToPoint(mutation);
                case "create-from-page":
                    return createPagemarkFromPage(mutation);
                case "update":
                    return updatePagemark(mutation);
                case "delete":
                    deletePagemark(mutation);
                    return [];
                case "update-mode":
                    return updatePagemarkMode(mutation);
                case "create-for-entire-document":
                    return createPagemarksForEntireDocument();
            }
        }
        function setPageNavigator(pageNavigator) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { pageNavigator }));
        }
        function onPageJump(page) {
            function doAsync() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield doPageJump(page);
                });
            }
            doAsync()
                .catch(err => log.error('Could not handle page jump: ', err));
        }
        function doPageJump(newPage) {
            return __awaiter(this, void 0, void 0, function* () {
                const store = storeProvider();
                const { pageNavigator } = store;
                if (!pageNavigator) {
                    return;
                }
                if (newPage <= 0) {
                    return;
                }
                if (newPage > pageNavigator.count) {
                    return;
                }
                if (newPage === pageNavigator.get()) {
                    return;
                }
                yield pageNavigator.jumpToPage(newPage);
                setStore(Object.assign(Object.assign({}, store), { page: newPage }));
            });
        }
        function doPageNav(delta) {
            function doAsync() {
                return __awaiter(this, void 0, void 0, function* () {
                    const store = storeProvider();
                    const { page } = store;
                    const newPage = page + delta;
                    yield doPageJump(newPage);
                });
            }
            doAsync()
                .catch(err => log.error("Could not handle page nav: ", err));
        }
        function onPageNext() {
            doPageNav(1);
        }
        function onPagePrev() {
            doPageNav(-1);
        }
        function setPage(page) {
            const store = storeProvider();
            if (store.page === page) {
                return;
            }
            setStore(Object.assign(Object.assign({}, store), { page }));
        }
        function writeDocMetaMutation(mutator) {
            const store = storeProvider();
            const { docMeta } = store;
            if (!docMeta) {
                return;
            }
            mutator(docMeta);
            writeUpdatedDocMetas([docMeta])
                .catch(err => log.error(err));
        }
        function setDocFlagged(flagged) {
            writeDocMetaMutation(docMeta => docMeta.docInfo.flagged = flagged);
        }
        function setDocArchived(archived) {
            writeDocMetaMutation(docMeta => docMeta.docInfo.archived = archived);
        }
        function doDocTagged(targets, tags, strategy) {
            if (targets.length === 0) {
                log.warn("doDocTagged: No targets");
            }
            for (const target of targets) {
                const { docMeta } = target;
                const newTags = Tags_1.Tags.computeNewTags(docMeta.docInfo.tags, tags, strategy);
                writeDocMetaMutation(docMeta => docMeta.docInfo.tags = Tags_1.Tags.toMap(newTags));
            }
        }
        function onDocTagged() {
            const { docMeta } = storeProvider();
            if (!docMeta) {
                return;
            }
            function targets() {
                if (!docMeta) {
                    return [];
                }
                return [
                    {
                        docMeta,
                        tags: docMeta.docInfo.tags
                    }
                ];
            }
            function createRelatedTagsManager() {
                function createNullRelatedTagsData() {
                    console.warn("Using null related tags data");
                    return {
                        docTagsIndex: {},
                        tagDocsIndex: {},
                        tagsIndex: {}
                    };
                }
                const data = LocalRelatedTagsStore_1.LocalRelatedTagsStore.read() || createNullRelatedTagsData();
                return new RelatedTagsManager_1.RelatedTagsManager(data);
            }
            const relatedTagsManager = createRelatedTagsManager();
            const relatedOptionsCalculator = relatedTagsManager.toRelatedOptionsCalculator();
            const tagsProvider = () => relatedTagsManager.tags();
            const opts = {
                targets,
                tagsProvider,
                dialogs,
                doTagged: doDocTagged,
                relatedOptionsCalculator
            };
            const callback = TaggedCallbacks_1.TaggedCallbacks.create(opts);
            callback();
        }
        function toggleDocFlagged() {
            var _a;
            const { docMeta } = storeProvider();
            if (!docMeta) {
                return;
            }
            setDocFlagged(!((_a = docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo) === null || _a === void 0 ? void 0 : _a.flagged));
        }
        function toggleDocArchived() {
            var _a;
            const { docMeta } = storeProvider();
            if (!docMeta) {
                return;
            }
            setDocArchived(!((_a = docMeta === null || docMeta === void 0 ? void 0 : docMeta.docInfo) === null || _a === void 0 ? void 0 : _a.archived));
        }
        function setOutline(outline) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { outline }));
        }
        function setOutlineNavigator(outlineNavigator) {
            const store = storeProvider();
            setStore(Object.assign(Object.assign({}, store), { outlineNavigator }));
        }
        function docMetaProvider() {
            const store = storeProvider();
            return store.docMeta;
        }
        return {
            updateDocMeta,
            setDocMeta,
            setDocDescriptor,
            setDocScale,
            setDocLoaded,
            setPageNavigator,
            annotationMutations,
            onPagemark,
            onPageJump,
            onPagePrev,
            onPageNext,
            setResizer,
            setScaleLeveler,
            setScale,
            doZoom,
            doZoomRestore,
            setPage,
            setFluidPagemarkFactory,
            setDocFlagged,
            setDocArchived,
            onDocTagged,
            toggleDocFlagged,
            toggleDocArchived,
            setOutline,
            setOutlineNavigator,
            docMetaProvider
        };
    }, [log, docMetaContext, persistenceLayerContext, annotationSidebarCallbacks,
        dialogs, annotationMutationCallbacksFactory, setStore, storeProvider]);
}
_a = ObservableStore_1.createObservableStore({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory: useCallbacksFactory
}), exports.DocViewerStoreProviderDelegate = _a[0], exports.useDocViewerStore = _a[1], exports.useDocViewerCallbacks = _a[2], exports.useDocViewerMutator = _a[3];
const DocViewerStoreInner = react_1.default.memo((props) => {
    const docViewerCallbacks = exports.useDocViewerCallbacks();
    return (react_1.default.createElement(AnnotationMutationsContext_1.AnnotationMutationsContextProvider, { value: docViewerCallbacks.annotationMutations }, props.children));
});
exports.DocViewerStore = react_1.default.memo((props) => {
    return (react_1.default.createElement(exports.DocViewerStoreProviderDelegate, null,
        react_1.default.createElement(DocViewerStoreInner, null, props.children)));
});
//# sourceMappingURL=DocViewerStore.js.map