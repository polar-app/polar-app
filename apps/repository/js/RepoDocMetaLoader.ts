import {DocMetaRef} from '../../../web/js/datastore/DocMetaRef';
import {Optional} from '../../../web/js/util/ts/Optional';
import {ListenablePersistenceLayer} from '../../../web/js/datastore/ListenablePersistenceLayer';
import {Logger} from '../../../web/js/logger/Logger';
import {ProgressCalculator} from '../../../web/js/util/ProgressCalculator';
import {ProgressBar} from '../../../web/js/ui/progress_bar/ProgressBar';
import {RepoDocInfoIndex} from './RepoDocInfoIndex';
import {RepoDocInfos} from './RepoDocInfos';
import {Dictionaries} from '../../../web/js/util/Dictionaries';
import {RepoDocInfo} from './RepoDocInfo';
import {DocMeta} from '../../../web/js/metadata/DocMeta';
import {DocMetaSnapshotEvent, SnapshotProgress, SnapshotUnsubscriber, DocMetaSnapshotEvents, MutationType} from '../../../web/js/datastore/Datastore';
import {ElectronContextTypes} from '../../../web/js/electron/context/ElectronContextTypes';
import {Promises} from '../../../web/js/util/Promises';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerManagerEvent} from '../../../web/js/datastore/PersistenceLayerManager';
import {NULL_FUNCTION} from '../../../web/js/util/Functions';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {IEventDispatcher, SimpleReactor} from '../../../web/js/reactor/SimpleReactor';
import {isPresent} from '../../../web/js/Preconditions';
import {ProgressTrackerIndex} from '../../../web/js/util/ProgressTrackerIndex';
import {EventListener} from '../../../web/js/reactor/EventListener';
import {RepoDocMeta} from './RepoDocMeta';
import {RepoDocMetas} from './RepoDocMetas';
import {DeterminateProgressBar} from '../../../web/js/ui/progress_bar/DeterminateProgressBar';

const log = Logger.create();

export class RepoDocMetaLoader {

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

    public async start() {

        // TODO: handle events properly..

        this.persistenceLayerManager.addEventListener(event => {

            if (event.state === 'changed') {
                this.onPersistenceLayerChanged(event.persistenceLayer);
            }

        }, 'changed');

    }

    private onPersistenceLayerChanged(persistenceLayer: PersistenceLayer) {

        let progressBar: ProgressBar | undefined;

        const progressTrackerIndex = new ProgressTrackerIndex();

        persistenceLayer.addDocMetaSnapshotEventListener(async docMetaSnapshotEvent => {

            const eventHandler = async () => {

                const {progress, docMetaMutations} = docMetaSnapshotEvent;

                progressTrackerIndex.update(progress);

                const minProgress = progressTrackerIndex.min();

                DeterminateProgressBar.update(minProgress);

                const mutations: RepoDocMetaMutation[] = [];

                for (const docMetaMutation of docMetaMutations) {

                    if (docMetaMutation.mutationType === 'created' ||
                        docMetaMutation.mutationType === 'updated') {

                        const docMeta = await docMetaMutation.docMetaProvider();
                        const docInfo = docMeta.docInfo;

                        const repoDocMeta = this.toRepoDocMeta(docInfo.fingerprint, docMeta);

                        if (repoDocMeta && RepoDocInfos.isValid(repoDocMeta.repoDocInfo)) {

                            mutations.push({
                                mutationType: docMetaMutation.mutationType,
                                fingerprint: docMetaMutation.fingerprint,
                                repoDocMeta
                            });

                        }

                    }

                    if (docMetaMutation.mutationType === 'deleted') {

                        mutations.push({
                            mutationType: docMetaMutation.mutationType,
                            fingerprint: docMetaMutation.fingerprint,
                        });

                    }

                }

                if (docMetaMutations.length > 0) {
                    this.eventDispatcher.dispatchEvent({mutations, progress});
                }

            };

            eventHandler()
                .catch(err => log.error("Could not handle snapshot: ", err));

        });

    }

    private toRepoDocMeta(fingerprint: string, docMeta?: DocMeta): RepoDocMeta | undefined {

        if (docMeta) {

            return RepoDocMetas.convert(fingerprint, docMeta);

        } else {
            log.warn("No DocMeta for fingerprint: " + fingerprint);
        }

        return undefined;

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
