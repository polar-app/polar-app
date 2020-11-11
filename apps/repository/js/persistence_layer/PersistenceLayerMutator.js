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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceLayerMutator = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Tags_1 = require("polar-shared/src/tags/Tags");
const Functions_1 = require("polar-shared/src/util/Functions");
const IDMaps_1 = require("polar-shared/src/util/IDMaps");
const DocMetas_1 = require("../../../../web/js/metadata/DocMetas");
const AnnotationTypes_1 = require("../../../../web/js/metadata/AnnotationTypes");
const AreaHighlights_1 = require("../../../../web/js/metadata/AreaHighlights");
const TextHighlights_1 = require("../../../../web/js/metadata/TextHighlights");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const log = Logger_1.Logger.create();
class PersistenceLayerMutator {
    constructor(repoDocMetaManager, persistenceLayerProvider, tagsProvider) {
        this.repoDocMetaManager = repoDocMetaManager;
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.tagsProvider = tagsProvider;
    }
    createTag(newTag) {
        return __awaiter(this, void 0, void 0, function* () {
            const persistenceLayer = this.persistenceLayerProvider();
            const userTagsDB = yield persistenceLayer.getUserTagsDB();
            userTagsDB.registerWhenAbsent(newTag);
            yield userTagsDB.commit();
        });
    }
    deleteTag(deleteTagID, progressCallback = Functions_1.NULL_FUNCTION) {
        const pruneRepoDocManager = () => {
            console.log("Pruning repo doc manager... ");
            this.repoDocMetaManager.repoDocAnnotationIndex.delete(deleteTagID);
            this.repoDocMetaManager.repoDocAnnotationIndex.prune();
            this.repoDocMetaManager.repoDocInfoIndex.delete(deleteTagID);
            this.repoDocMetaManager.repoDocInfoIndex.prune();
            console.log("Pruning repo doc manager... done");
        };
        const prepare = () => {
            pruneRepoDocManager();
        };
        const commit = () => {
            const doCommit = () => __awaiter(this, void 0, void 0, function* () {
                const deleteFromUserTags = () => __awaiter(this, void 0, void 0, function* () {
                    console.log("Deleting user tags... ");
                    const persistenceLayer = this.persistenceLayerProvider();
                    const userTagsDB = yield persistenceLayer.getUserTagsDB();
                    if (userTagsDB.delete(deleteTagID)) {
                    }
                    yield userTagsDB.commit();
                    console.log("Deleting user tags... done");
                });
                const lookupTag = (tag) => {
                    const tagMap = IDMaps_1.IDMaps.create(this.tagsProvider());
                    return tagMap[tag] || {
                        id: tag,
                        label: tag
                    };
                };
                const tagToDelete = lookupTag(deleteTagID);
                if (tagToDelete) {
                    pruneRepoDocManager();
                    console.log("Removing tags from doc metas... ");
                    yield this.removeTagsFromDocMetas(tagToDelete, progressCallback);
                    console.log("Removing tags from doc metas... done");
                    yield deleteFromUserTags();
                    pruneRepoDocManager();
                }
                else {
                    console.warn("Tag does not exist: " + deleteTagID);
                }
            });
            return doCommit();
        };
        return { prepare, commit };
    }
    renameTag(renameTagID, progressCallback = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteFromRepoDocManager = () => {
                this.repoDocMetaManager.repoDocAnnotationIndex.prune();
                this.repoDocMetaManager.repoDocInfoIndex.prune();
            };
            const renameWithinUserTags = () => __awaiter(this, void 0, void 0, function* () {
                const persistenceLayer = this.persistenceLayerProvider();
                const userTagsDB = yield persistenceLayer.getUserTagsDB();
                userTagsDB.rename(renameTagID);
                yield userTagsDB.commit();
            });
            const lookupTag = (tag) => {
                const tagMap = IDMaps_1.IDMaps.create(this.tagsProvider());
                return tagMap[tag] || {
                    id: tag,
                    label: tag
                };
            };
            const renameTag = lookupTag(renameTagID);
            if (renameTag) {
            }
            else {
                console.warn("Tag does not exist: " + renameTagID);
            }
        });
    }
    removeTagsFromDocMetas(deleteTag, progressCallback = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const docsTagged = (tag) => {
                return this.repoDocMetaManager.repoDocInfoIndex.tagged(tag);
            };
            const docsWithAnnotationsTagged = (tag) => {
                const annotationIndex = this.repoDocMetaManager.repoDocAnnotationIndex;
                const annotationIDs = annotationIndex.tagged(tag);
                return ArrayStreams_1.ArrayStreams.create(annotationIDs)
                    .map(annotationID => annotationIndex.get(annotationID))
                    .filter(annotation => Preconditions_1.isPresent(annotation))
                    .map(annotation => annotation)
                    .map(annotation => annotation.docInfo.fingerprint)
                    .unique()
                    .collect();
            };
            const docIDs = [
                ...docsTagged(deleteTag),
                ...docsWithAnnotationsTagged(deleteTag),
            ];
            const persistenceLayer = this.persistenceLayerProvider();
            const computeNewTags = (tags) => {
                const existingTags = Object.values(tags || {});
                return Tags_1.Tags.toMap(Tags_1.Tags.difference(existingTags, [deleteTag]));
            };
            const removeTagsFromDocInfo = (docMeta) => {
                docMeta.docInfo.tags = computeNewTags(docMeta.docInfo.tags);
            };
            const removeTagsFromAnnotations = (docMeta) => {
                DocMetas_1.DocMetas.annotations(docMeta, ((pageMeta, annotation, type) => {
                    const hasTag = () => {
                        const tags = (annotation.tags || {});
                        return Preconditions_1.isPresent(tags[deleteTag.id]);
                    };
                    if (!hasTag()) {
                        log.notice("Skipped annotation without tag: " + docMeta.docInfo.fingerprint, annotation);
                        return;
                    }
                    const tags = computeNewTags(annotation.tags);
                    if (AnnotationTypes_1.AnnotationTypes.isTextHighlight(annotation, type)) {
                        const updated = TextHighlights_1.TextHighlights.update(annotation.id, docMeta, pageMeta, { tags });
                    }
                    if (AnnotationTypes_1.AnnotationTypes.isAreaHighlight(annotation, type)) {
                        AreaHighlights_1.AreaHighlights.update(annotation.id, docMeta, pageMeta, { tags });
                    }
                }));
            };
            const progressTracker = new ProgressTracker_1.ProgressTracker({
                total: docIDs.length,
                id: 'removeTagsFromDocMetas'
            });
            for (const docID of docIDs) {
                const docMeta = yield persistenceLayer.getDocMeta(docID);
                if (!docMeta) {
                    continue;
                }
                DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
                    removeTagsFromDocInfo(docMeta);
                    removeTagsFromAnnotations(docMeta);
                });
                yield persistenceLayer.writeDocMeta(docMeta);
                progressCallback(progressTracker.incr());
            }
            log.notice("Removed tags from N documents: " + docIDs.length);
        });
    }
}
exports.PersistenceLayerMutator = PersistenceLayerMutator;
//# sourceMappingURL=PersistenceLayerMutator.js.map