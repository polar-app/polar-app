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
exports.RepoDocMetaManager = exports.RepoDocInfoDataObjectIndex = exports.RepoDocAnnotationDataObjectIndex = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const DocInfo_1 = require("../../../web/js/metadata/DocInfo");
const Tags_1 = require("polar-shared/src/tags/Tags");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const DocMetaRef_1 = require("../../../web/js/datastore/DocMetaRef");
const RelatedTagsManager_1 = require("../../../web/js/tags/related/RelatedTagsManager");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const DataObjectIndex_1 = require("./index/DataObjectIndex");
const RepoDocAnnotations_1 = require("./RepoDocAnnotations");
const RepoDocInfos_1 = require("./RepoDocInfos");
const DocViewerSnapshots_1 = require("../../doc/src/DocViewerSnapshots");
const log = Logger_1.Logger.create();
class RepoDocAnnotationDataObjectIndex extends DataObjectIndex_1.DataObjectIndex {
    constructor() {
        super((repoAnnotation) => RepoDocAnnotations_1.RepoDocAnnotations.toTags(repoAnnotation));
    }
}
exports.RepoDocAnnotationDataObjectIndex = RepoDocAnnotationDataObjectIndex;
class RepoDocInfoDataObjectIndex extends DataObjectIndex_1.DataObjectIndex {
    constructor() {
        super((repoDocInfo) => RepoDocInfos_1.RepoDocInfos.toTags(repoDocInfo));
    }
}
exports.RepoDocInfoDataObjectIndex = RepoDocInfoDataObjectIndex;
class RepoDocMetaManager {
    constructor(persistenceLayerProvider) {
        this.repoDocInfoIndex = new RepoDocInfoDataObjectIndex();
        this.repoDocAnnotationIndex = new RepoDocAnnotationDataObjectIndex();
        this.relatedTagsManager = new RelatedTagsManager_1.RelatedTagsManager();
        Preconditions_1.Preconditions.assertPresent(persistenceLayerProvider, 'persistenceLayerProvider');
        this.persistenceLayerProvider = persistenceLayerProvider;
    }
    updateFromRepoDocMeta(fingerprint, repoDocMeta) {
        if (repoDocMeta) {
            const isStaleUpdate = () => {
                const existing = this.repoDocInfoIndex.get(fingerprint);
                if (DocViewerSnapshots_1.DocViewerSnapshots.computeUpdateType3(existing === null || existing === void 0 ? void 0 : existing.docInfo.uuid, repoDocMeta.repoDocInfo.docInfo.uuid).type === 'stale') {
                    return true;
                }
                if (DocViewerSnapshots_1.DocViewerSnapshots.computeUpdateType3(existing === null || existing === void 0 ? void 0 : existing.docMeta.docInfo.uuid, repoDocMeta.repoDocInfo.docMeta.docInfo.uuid).type === 'stale') {
                    return true;
                }
                return false;
            };
            if (isStaleUpdate()) {
                return;
            }
            this.repoDocInfoIndex.put(repoDocMeta.repoDocInfo.fingerprint, repoDocMeta.repoDocInfo);
            this.relatedTagsManager.update(fingerprint, 'set', Object.values(repoDocMeta.repoDocInfo.tags || {}));
            const updateAnnotations = () => {
                const deleteOrphaned = () => {
                    const currentAnnotationsIDs = this.repoDocAnnotationIndex.values()
                        .filter(current => current.fingerprint === repoDocMeta.repoDocInfo.fingerprint)
                        .map(current => current.id);
                    const newAnnotationIDs = repoDocMeta.repoDocAnnotations
                        .map(current => current.id);
                    const deleteIDs = SetArrays_1.SetArrays.difference(currentAnnotationsIDs, newAnnotationIDs);
                    for (const deleteID of deleteIDs) {
                        this.repoDocAnnotationIndex.delete(deleteID);
                    }
                };
                const updateExisting = () => {
                    for (const repoDocAnnotation of repoDocMeta.repoDocAnnotations) {
                        this.repoDocAnnotationIndex.put(repoDocAnnotation.id, repoDocAnnotation);
                    }
                };
                deleteOrphaned();
                updateExisting();
            };
            updateAnnotations();
        }
        else {
            const deleteOrphanedAnnotations = () => {
                for (const repoAnnotation of this.repoDocAnnotationIndex.values()) {
                    if (repoAnnotation.fingerprint === fingerprint) {
                        this.repoDocAnnotationIndex.delete(repoAnnotation.id);
                    }
                }
            };
            const deleteDoc = () => {
                this.repoDocInfoIndex.delete(fingerprint);
            };
            deleteOrphanedAnnotations();
            deleteDoc();
        }
    }
    updateFromRepoDocInfo(fingerprint, repoDocInfo) {
        if (repoDocInfo) {
            this.repoDocInfoIndex.put(fingerprint, repoDocInfo);
        }
        else {
            this.repoDocInfoIndex.delete(fingerprint);
        }
    }
    writeDocInfo(docInfo, docMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(this.persistenceLayerProvider, 'persistenceLayerProvider');
            const persistenceLayer = this.persistenceLayerProvider.get();
            docMeta.docInfo = new DocInfo_1.DocInfo(docInfo);
            log.info("Writing out updated DocMeta");
            yield persistenceLayer.writeDocMeta(docMeta);
        });
    }
    writeDocInfoTitle(repoDocInfo, title) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertPresent(repoDocInfo);
            Preconditions_1.Preconditions.assertPresent(repoDocInfo.docInfo);
            Preconditions_1.Preconditions.assertPresent(title);
            repoDocInfo = Object.assign(Object.assign({}, repoDocInfo), { title });
            repoDocInfo.docInfo.title = title;
            this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);
            return this.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
        });
    }
    writeDocInfoTags(repoDocInfo, tags) {
        const prepare = () => {
            Preconditions_1.Preconditions.assertPresent(repoDocInfo);
            Preconditions_1.Preconditions.assertPresent(repoDocInfo.docInfo);
            Preconditions_1.Preconditions.assertPresent(tags);
            repoDocInfo = Object.assign(Object.assign({}, repoDocInfo), { tags: Tags_1.Tags.toMap(tags) });
            repoDocInfo.docInfo.tags = Tags_1.Tags.toMap(tags);
            this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);
        };
        const commit = () => {
            return this.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
        };
        return { prepare, commit };
    }
    deleteDocInfo(repoDocInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateFromRepoDocInfo(repoDocInfo.fingerprint);
            const persistenceLayer = this.persistenceLayerProvider.get();
            const docMetaFileRef = DocMetaRef_1.DocMetaFileRefs.createFromDocInfo(repoDocInfo.docInfo);
            yield persistenceLayer.delete(docMetaFileRef);
        });
    }
}
exports.RepoDocMetaManager = RepoDocMetaManager;
//# sourceMappingURL=RepoDocMetaManager.js.map