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
exports.RepoDocMetaLoader = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const RepoDocInfos_1 = require("./RepoDocInfos");
const SimpleReactor_1 = require("../../../web/js/reactor/SimpleReactor");
const ProgressTrackerIndex_1 = require("polar-shared/src/util/ProgressTrackerIndex");
const RepoDocMetas_1 = require("./RepoDocMetas");
const DeterminateProgressBar_1 = require("../../../web/js/ui/progress_bar/DeterminateProgressBar");
const IndeterminateProgressBars_1 = require("../../../web/js/ui/progress_bar/IndeterminateProgressBars");
const AsyncArrayStreams_1 = require("polar-shared/src/util/AsyncArrayStreams");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const log = Logger_1.Logger.create();
class RepoDocMetaLoader {
    constructor(persistenceLayerManager) {
        this.eventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.persistenceLayerManager = persistenceLayerManager;
    }
    addEventListener(listener) {
        return this.eventDispatcher.addEventListener(listener);
    }
    removeEventListener(listener) {
        return this.eventDispatcher.removeEventListener(listener);
    }
    dispatchEvent(event) {
        this.eventDispatcher.dispatchEvent(event);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.persistenceLayerManager.addEventListener(event => {
                if (event.state === 'changed') {
                    this.onPersistenceLayerChanged(event.persistenceLayer);
                }
            }, 'changed');
        });
    }
    onPersistenceLayerChanged(persistenceLayer) {
        log.info("onPersistenceLayerChanged");
        this.addInitialProgressListener(persistenceLayer);
        const progressTrackerIndex = new ProgressTrackerIndex_1.ProgressTrackerIndex();
        persistenceLayer.addDocMetaSnapshotEventListener((docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
            const doAsync = () => __awaiter(this, void 0, void 0, function* () {
                const { progress, docMetaMutations } = docMetaSnapshotEvent;
                progressTrackerIndex.update(progress);
                const minProgress = progressTrackerIndex.min();
                if (minProgress.isPresent()) {
                    DeterminateProgressBar_1.DeterminateProgressBar.update(minProgress.get());
                }
                else {
                    DeterminateProgressBar_1.DeterminateProgressBar.update(100);
                }
                yield this.dispatchMutations(docMetaMutations, progress);
            });
            doAsync()
                .catch(err => log.error("Could not handle snapshot: ", err));
        }));
    }
    dispatchMutations(docMetaMutations, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectConverter = new ObjectConverter(() => this.persistenceLayerManager.get());
            const mutations = yield objectConverter.toRepoDocMetaMutations(docMetaMutations);
            if (mutations.length > 0) {
                this.eventDispatcher.dispatchEvent({ mutations, progress });
            }
        });
    }
    update(docMeta, mutationType) {
        return __awaiter(this, void 0, void 0, function* () {
            const fingerprint = docMeta.docInfo.fingerprint;
            const docMetaMutation = {
                fingerprint,
                mutationType,
                docMetaProvider: () => __awaiter(this, void 0, void 0, function* () { return docMeta; }),
                docInfoProvider: () => __awaiter(this, void 0, void 0, function* () { return docMeta.docInfo; })
            };
            const progress = ProgressTracker_1.ProgressTrackers.singleTaskTerminated('doc-meta-update:' + fingerprint);
            yield this.dispatchMutations([docMetaMutation], progress);
        });
    }
    addInitialProgressListener(persistenceLayer) {
        let progressBar = IndeterminateProgressBars_1.IndeterminateProgressBars.create();
        persistenceLayer.addDocMetaSnapshotEventListener(() => __awaiter(this, void 0, void 0, function* () {
            if (progressBar) {
                progressBar.destroy();
                progressBar = null;
            }
        }));
    }
}
exports.RepoDocMetaLoader = RepoDocMetaLoader;
class ObjectConverter {
    constructor(persistenceLayerProvider) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }
    toRepoDocMeta(fingerprint, docMeta) {
        if (docMeta) {
            return RepoDocMetas_1.RepoDocMetas.convert(this.persistenceLayerProvider, fingerprint, docMeta);
        }
        else {
            log.warn("No DocMeta for fingerprint: " + fingerprint);
        }
        return undefined;
    }
    toRepoDocMetaMutations(docMetaMutations) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutations = yield AsyncArrayStreams_1.asyncStream(docMetaMutations)
                .map(current => this.toRepoDocMetaMutation(current))
                .present()
                .collect();
            return mutations;
        });
    }
    toRepoDocMetaMutation(docMetaMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (docMetaMutation.mutationType) {
                case "created":
                case "updated":
                    const docMeta = yield docMetaMutation.docMetaProvider();
                    if (!docMeta) {
                        return undefined;
                    }
                    const docInfo = docMeta.docInfo;
                    const repoDocMeta = this.toRepoDocMeta(docInfo.fingerprint, docMeta);
                    if (repoDocMeta && RepoDocInfos_1.RepoDocInfos.isValid(repoDocMeta.repoDocInfo)) {
                        return {
                            mutationType: docMetaMutation.mutationType,
                            fingerprint: docMetaMutation.fingerprint,
                            repoDocMeta
                        };
                    }
                    else {
                        return undefined;
                    }
                case "deleted":
                    return {
                        mutationType: docMetaMutation.mutationType,
                        fingerprint: docMetaMutation.fingerprint,
                    };
            }
        });
    }
}
//# sourceMappingURL=RepoDocMetaLoader.js.map