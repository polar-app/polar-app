import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoDocInfos} from './RepoDocInfos';
import {
    MinimalDocMetaMutation,
    MutationType,
    SnapshotProgress
} from '../../../web/js/datastore/Datastore';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {
    PersistenceLayer,
    PersistenceLayerProvider
} from '../../../web/js/datastore/PersistenceLayer';
import {
    IEventDispatcher,
    SimpleReactor
} from '../../../web/js/reactor/SimpleReactor';
import {ProgressTrackerIndex} from 'polar-shared/src/util/ProgressTrackerIndex';
import {EventListener} from '../../../web/js/reactor/EventListener';
import {RepoDocMeta} from './RepoDocMeta';
import {RepoDocMetas} from './RepoDocMetas';
import {DeterminateProgressBar} from '../../../web/js/ui/progress_bar/DeterminateProgressBar';
import {IndeterminateProgressBars} from '../../../web/js/ui/progress_bar/IndeterminateProgressBars';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";
import {
    Progress,
    ProgressTrackers
} from "polar-shared/src/util/ProgressTracker";

const log = Logger.create();

export interface RepoDocMetaUpdater {
    update(docMeta: IDocMeta, mutationType: MutationType): Promise<void>;
}

export class RepoDocMetaLoader implements RepoDocMetaUpdater {

    private readonly persistenceLayerManager: PersistenceLayerManager;

    private readonly eventDispatcher: IEventDispatcher<RepoDocMetaEvent> = new SimpleReactor();

    constructor(persistenceLayerManager: PersistenceLayerManager) {
        this.persistenceLayerManager = persistenceLayerManager;
    }

    public addEventListener(listener: EventListener<RepoDocMetaEvent>) {
        return this.eventDispatcher.addEventListener(listener);
    }

    public removeEventListener(listener: EventListener<RepoDocMetaEvent>) {
        return this.eventDispatcher.removeEventListener(listener);
    }

    public dispatchEvent(event: RepoDocMetaEvent) {
        this.eventDispatcher.dispatchEvent(event);
    }

    public async start() {

        // TODO: handle events properly..

        this.persistenceLayerManager.addEventListener(event => {

            if (event.state === 'changed') {
                this.onPersistenceLayerChanged(event.persistenceLayer);
            }

        }, 'changed');

    }

    private onPersistenceLayerChanged(persistenceLayer: PersistenceLayer) {

        log.info("onPersistenceLayerChanged");

        this.addInitialProgressListener(persistenceLayer);

        const progressTrackerIndex = new ProgressTrackerIndex();

        persistenceLayer.addDocMetaSnapshotEventListener(async docMetaSnapshotEvent => {

            const doAsync = async () => {

                const {progress, docMetaMutations} = docMetaSnapshotEvent;

                progressTrackerIndex.update(progress);

                const minProgress = progressTrackerIndex.min();

                if (minProgress.isPresent()) {
                    DeterminateProgressBar.update(minProgress.get());
                } else {
                    DeterminateProgressBar.update(100);
                }

                await this.dispatchMutations(docMetaMutations, progress);

            };

            doAsync()
                .catch(err => log.error("Could not handle snapshot: ", err));

        });

    }

    private async dispatchMutations(docMetaMutations: ReadonlyArray<MinimalDocMetaMutation>,
                                    progress: Progress) {

        const objectConverter = new ObjectConverter(() => this.persistenceLayerManager.get());

        const mutations = await objectConverter.toRepoDocMetaMutations(docMetaMutations);

        if (mutations.length > 0) {
            this.eventDispatcher.dispatchEvent({mutations, progress});
        }

    }

    public async update(docMeta: IDocMeta, mutationType: MutationType) {

        const fingerprint = docMeta.docInfo.fingerprint;

        const docMetaMutation: MinimalDocMetaMutation = {
            fingerprint,
            mutationType,
            docMetaProvider: async () => docMeta,
            docInfoProvider: async () => docMeta.docInfo,
            fromCache: false,
            hasPendingWrites: true
        };

        const progress = ProgressTrackers.singleTaskTerminated('doc-meta-update:' + fingerprint);

        await this.dispatchMutations([docMetaMutation], progress);

    }

    private addInitialProgressListener(persistenceLayer: PersistenceLayer) {

        let progressBar = IndeterminateProgressBars.create();

        persistenceLayer.addDocMetaSnapshotEventListener(async () => {

            if (progressBar) {
                progressBar.destroy();
                progressBar = null!;
            }

        });

    }

}

export interface RepoDocMetaEvent {
    readonly mutations: ReadonlyArray<RepoDocMetaMutation>;
    readonly progress: SnapshotProgress;
}

export interface RepoDocMetaMutation {
    readonly mutationType: MutationType;
    readonly fingerprint: string;

    // only present on created / updated
    readonly repoDocMeta?: RepoDocMeta;
}

class ObjectConverter {

    constructor(private readonly persistenceLayerProvider: PersistenceLayerProvider) {

    }

    public toRepoDocMeta(fingerprint: string,
                         fromCache: boolean,
                         hasPendingWrites: boolean,
                         docMeta?: IDocMeta): RepoDocMeta | undefined {

        if (docMeta) {

            return RepoDocMetas.convert(this.persistenceLayerProvider, fingerprint, fromCache, hasPendingWrites, docMeta);

        } else {
            log.warn("No DocMeta for fingerprint: " + fingerprint);
        }

        return undefined;

    }

    public async toRepoDocMetaMutations(docMetaMutations: ReadonlyArray<MinimalDocMetaMutation>) {

        const mutations = await asyncStream(docMetaMutations)
            .map(current => this.toRepoDocMetaMutation(current))
            .present()
            .collect();

        return mutations;

    }

    public async toRepoDocMetaMutation(docMetaMutation: MinimalDocMetaMutation): Promise<RepoDocMetaMutation | undefined> {

        switch (docMetaMutation.mutationType) {
            case "created":
            case "updated":
                const docMeta = await docMetaMutation.docMetaProvider();

                if (! docMeta) {
                    return undefined;
                }

                const docInfo = docMeta.docInfo;

                const repoDocMeta = this.toRepoDocMeta(docInfo.fingerprint,
                                                       docMetaMutation.fromCache,
                                                       docMetaMutation.hasPendingWrites,
                                                       docMeta, );

                if (repoDocMeta && RepoDocInfos.isValid(repoDocMeta.repoDocInfo)) {

                    return {
                        mutationType: docMetaMutation.mutationType,
                        fingerprint: docMetaMutation.fingerprint,
                        repoDocMeta
                    };

                } else {
                    return undefined;
                }

            case "deleted":
                return {
                    mutationType: docMetaMutation.mutationType,
                    fingerprint: docMetaMutation.fingerprint,
                };

        }

    }

}


