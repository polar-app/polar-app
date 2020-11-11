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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnnotationMutationCallbacksFactory = void 0;
const React = __importStar(require("react"));
const AnnotationMutations_1 = require("polar-shared/src/metadata/mutations/AnnotationMutations");
const PersistenceLayerApp_1 = require("../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const TaggedCallbacks_1 = require("../../../apps/repository/js/annotation_repo/TaggedCallbacks");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Tags_1 = require("polar-shared/src/tags/Tags");
const MUIDialogControllers_1 = require("../mui/dialogs/MUIDialogControllers");
const AreaHighlights_1 = require("../metadata/AreaHighlights");
const AreaHighlightRects_1 = require("../metadata/AreaHighlightRects");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const DocMetaLookupContextProvider_1 = require("./DocMetaLookupContextProvider");
const MUILogger_1 = require("../mui/MUILogger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const DocMetas_1 = require("../metadata/DocMetas");
const AnnotationMutationsContext_1 = require("./AnnotationMutationsContext");
function useAnnotationMutationCallbacksFactory() {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const persistenceLayerContext = PersistenceLayerApp_1.usePersistenceLayerContext();
    const docMetaLookupContext = DocMetaLookupContextProvider_1.useDocMetaLookupContext();
    const tagsContext = PersistenceLayerApp_1.useTagsContext();
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const log = MUILogger_1.useLogger();
    return React.useCallback((updateStore, refresher) => {
        function writeUpdatedDocMetas(updatedDocMetas) {
            return __awaiter(this, void 0, void 0, function* () {
                updatedDocMetas = updatedDocMetas.map(DocMetas_1.DocMetas.updated);
                updatedDocMetas = updateStore(updatedDocMetas);
                refresher();
                const { persistenceLayerProvider } = persistenceLayerContext;
                for (const docMeta of updatedDocMetas) {
                    const persistenceLayer = persistenceLayerProvider();
                    yield persistenceLayer.writeDocMeta(docMeta);
                }
            });
        }
        function handleUpdate(mutation, annotationMutator) {
            return __awaiter(this, void 0, void 0, function* () {
                const selected = docMetaLookupContext.lookupAnnotations(mutation.selected);
                const partitions = ArrayStreams_1.arrayStream(selected)
                    .partition(annotation => [annotation.docMetaRef.id, docMetaLookupContext.lookup(annotation.docMetaRef.id)]);
                for (const partition of Object.values(partitions)) {
                    const docMeta = partition.key;
                    for (const annotation of selected) {
                        const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, annotation.pageNum);
                        annotationMutator(docMeta, pageMeta, Object.assign(Object.assign({}, mutation), { selected: [annotation] }));
                    }
                }
                const updatedDocMetas = Object.values(partitions)
                    .map(current => current.key);
                yield writeUpdatedDocMetas(updatedDocMetas);
            });
        }
        function handleUpdate2(holders, annotationMutator) {
            return __awaiter(this, void 0, void 0, function* () {
                const resolvedHolders = docMetaLookupContext.lookupAnnotationHolders(holders);
                for (const resolvedHolder of resolvedHolders) {
                    annotationMutator(resolvedHolder);
                }
                const updatedDocMetas = Object.values(resolvedHolders)
                    .map(current => current.annotation.docMeta);
                yield writeUpdatedDocMetas(updatedDocMetas);
            });
        }
        function doTagged(annotations, tags, strategy = 'set') {
            handleUpdate({ selected: annotations }, (docMeta, pageMeta, mutation) => {
                for (const current of mutation.selected) {
                    const newTags = Tags_1.Tags.computeNewTags(current.original.tags, tags, strategy);
                    const updates = {
                        tags: Tags_1.Tags.toMap(newTags)
                    };
                    AnnotationMutations_1.AnnotationMutations.update(Object.assign(Object.assign({}, current), { docMeta }), Object.assign(Object.assign({}, current.original), updates));
                }
            }).catch(err => log.error(err));
        }
        function createTaggedCallback(mutation) {
            function toTarget(annotation) {
                return Object.assign(Object.assign({}, annotation), { tags: annotation.original.tags });
            }
            function buildRelatedOptionsCalculator() {
                if (repoDocMetaManager) {
                    const { relatedTagsManager } = repoDocMetaManager;
                    return relatedTagsManager.toRelatedOptionsCalculator();
                }
                return undefined;
            }
            const relatedOptionsCalculator = buildRelatedOptionsCalculator();
            const opts = {
                targets: () => mutation.selected.map(toTarget),
                tagsProvider: tagsContext.tagsProvider,
                dialogs,
                doTagged,
                relatedOptionsCalculator
            };
            return TaggedCallbacks_1.TaggedCallbacks.create(opts);
        }
        function onTagged(mutation) {
            createTaggedCallback(mutation)();
        }
        function useDeletedCallback(mutation) {
            return React.useCallback(() => {
                onDeleted(mutation);
            }, [mutation]);
        }
        function onDeleted(mutation) {
            const annotations = docMetaLookupContext.lookupAnnotations(mutation.selected);
            if (annotations.length === 0) {
                log.warn("no repoAnnotation");
                return;
            }
            dialogs.confirm({
                title: "Are you sure you want to delete this item?",
                subtitle: "This is a permanent operation and can't be undone.",
                onAccept: () => doDeleted(annotations)
            });
        }
        function doDeleted(annotations) {
            const mutation = {
                selected: docMetaLookupContext.lookupAnnotations(annotations)
            };
            handleUpdate(mutation, AnnotationMutationsContext_1.DocAnnotationsMutator.onDeleted)
                .catch(err => log.error(err));
        }
        function onAreaHighlight(mutation) {
            function doAsync() {
                return __awaiter(this, void 0, void 0, function* () {
                    const { docMeta, pageMeta, areaHighlight, capturedScreenshot, position } = mutation;
                    Preconditions_1.Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot');
                    function toAreaHighlightRect() {
                        const rect = Arrays_1.Arrays.first(Object.values(areaHighlight.rects));
                        return AreaHighlightRects_1.AreaHighlightRects.createFromRect(rect);
                    }
                    const areaHighlightRect = toAreaHighlightRect();
                    const { persistenceLayerProvider } = persistenceLayerContext;
                    const writeOpts = {
                        datastore: persistenceLayerProvider(),
                        docMeta,
                        pageMeta,
                        areaHighlight,
                        areaHighlightRect,
                        position,
                        capturedScreenshot
                    };
                    const writer = AreaHighlights_1.AreaHighlights.createWriter(writeOpts);
                    const [, committer] = writer.prepare();
                    updateStore([docMeta]);
                    yield committer.commit();
                    updateStore([docMeta]);
                    refresher();
                });
            }
            doAsync()
                .catch(err => log.error(err));
        }
        function onTextHighlight(mutation) {
            switch (mutation.type) {
                case "revert":
                case "update":
                    handleUpdate(mutation, AnnotationMutationsContext_1.DocAnnotationsMutator.onTextHighlight)
                        .catch(err => log.error(err));
                    break;
                case "create":
                    const { docMeta, pageMeta, textHighlight } = mutation;
                    pageMeta.textHighlights[textHighlight.id] = textHighlight;
                    writeUpdatedDocMetas([docMeta])
                        .catch(err => log.error(err));
                    break;
            }
        }
        function createCommentCallback(annotation) {
            return React.useCallback((mutation) => {
                const holder = {
                    annotation,
                    mutation
                };
                onComment([holder]);
            }, [annotation]);
        }
        function onComment(holders) {
            handleUpdate2(holders, AnnotationMutationsContext_1.DocAnnotationsMutator.onComment)
                .catch(err => log.error(err));
        }
        function createFlashcardCallback(annotation) {
            return React.useCallback((mutation) => {
                const holder = {
                    annotation,
                    mutation
                };
                onFlashcard([holder]);
            }, [annotation]);
        }
        function onFlashcard(holders) {
            handleUpdate2(holders, AnnotationMutationsContext_1.DocAnnotationsMutator.onFlashcard)
                .catch(err => log.error(err));
        }
        function createColorCallback(selected) {
            return React.useCallback((mutation) => {
                onColor(Object.assign(Object.assign({}, selected), mutation));
            }, [selected]);
        }
        function onColor(colorMutation) {
            handleUpdate({ selected: colorMutation.selected }, (docMeta, pageMeta, mutation) => {
                for (const current of mutation.selected) {
                    const updates = {
                        color: colorMutation.color
                    };
                    AnnotationMutations_1.AnnotationMutations.update(Object.assign(Object.assign({}, current), { docMeta }), Object.assign(Object.assign({}, current.original), updates));
                }
            }).catch(err => log.error(err));
        }
        return {
            writeUpdatedDocMetas,
            createDeletedCallback: useDeletedCallback,
            onDeleted,
            onAreaHighlight,
            onTextHighlight,
            createCommentCallback,
            onComment,
            createFlashcardCallback,
            onFlashcard,
            createColorCallback,
            onColor,
            createTaggedCallback,
            doTagged,
            onTagged,
        };
    }, [dialogs, persistenceLayerContext, docMetaLookupContext, tagsContext, repoDocMetaManager, log]);
}
exports.useAnnotationMutationCallbacksFactory = useAnnotationMutationCallbacksFactory;
//# sourceMappingURL=AnnotationMutationCallbacks.js.map