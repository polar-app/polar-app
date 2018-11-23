import {DocMetaRef} from '../../../web/js/datastore/DocMetaRef';
import {Optional} from '../../../web/js/util/ts/Optional';
import {IListenablePersistenceLayer} from '../../../web/js/datastore/IListenablePersistenceLayer';
import {Logger} from '../../../web/js/logger/Logger';
import {Progress} from '../../../web/js/util/Progress';
import {ProgressBar} from '../../../web/js/ui/progress_bar/ProgressBar';
import {RepoDocInfoIndex} from './RepoDocInfoIndex';
import {RepoDocInfos} from './RepoDocInfos';
import {Dictionaries} from '../../../web/js/util/Dictionaries';
import {RepoDocInfo} from './RepoDocInfo';
import {DocMeta} from '../../../web/js/metadata/DocMeta';
import {DocMetaSnapshotEvent} from '../../../web/js/datastore/Datastore';
import {ElectronContextTypes} from '../../../web/js/electron/context/ElectronContextTypes';
import {Promises} from '../../../web/js/util/Promises';

const log = Logger.create();

export class RepoDocInfoLoader {

    private readonly persistenceLayer: IListenablePersistenceLayer;

    constructor(persistenceLayer: IListenablePersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    public async load(): Promise<RepoDocInfoIndex> {

        let result = await this.loadFromPersistenceLayer();
        result = await this.filterInvalid(result);

        return result;

    }

    private async loadFromPersistenceLayer(): Promise<RepoDocInfoIndex> {

        const result: RepoDocInfoIndex = {};

        const progressBar = ProgressBar.create(false);

        // TODO: there's latency here as we shouldn't have to load the ENTIRE
        // doc repo to update the UI...  We should update it as it's parsed via
        // events.

        await this.persistenceLayer.snapshot(async (docMetaSnapshotEvent: DocMetaSnapshotEvent) => {

            // docMetaSnapshotEvent = Dictionaries.copyOf(docMetaSnapshotEvent);

            const {progress, docMetaMutations} = docMetaSnapshotEvent;

            for (const docMetaMutation of docMetaMutations) {

                const {docMeta, docInfo} = docMetaMutation;

                const repoDocInfo = await this.loadDocMeta(docInfo.fingerprint, docMeta);

                if (repoDocInfo) {
                    result[repoDocInfo.fingerprint] = repoDocInfo;
                }

                progressBar.update(progress.progress);

            }

        });

        progressBar.destroy();

        return result;
    }

    private async loadDocMetaFile(docMetaRef: DocMetaRef): Promise<RepoDocInfo | undefined> {

        if (! this.persistenceLayer) {
            throw new Error("No persistence layer");
        }

        let docMeta: DocMeta | undefined;

        try {

            docMeta = await this.persistenceLayer.getDocMeta(docMetaRef.fingerprint);

            return this.loadDocMeta(docMetaRef.fingerprint, docMeta);

        } catch (e) {
            log.error("Unable to load DocMeta for " + docMetaRef.fingerprint, e);

            return undefined;
        }

    }

    private async loadDocMeta(fingerprint: string, docMeta?: DocMeta): Promise<RepoDocInfo | undefined> {

        if (docMeta !== undefined) {

            if (docMeta.docInfo) {

                return RepoDocInfos.convertFromDocInfo(docMeta.docInfo);

            } else {
                log.warn("No docInfo for file: ", fingerprint);
            }

        } else {
            log.warn("No DocMeta for fingerprint: " + fingerprint);
        }

        return undefined;

    }



    /**
     * Some of our documents might be broken and we should filter them to not
     * break the UI.
     *
     * @param repoDocInfoIndex
     */
    private async filterInvalid(repoDocInfoIndex: RepoDocInfoIndex) {

        const filtered = Object.values(repoDocInfoIndex)
            .filter(current => RepoDocInfos.isValid(current));

        return Dictionaries.toDict(filtered, (value) => value.fingerprint);

    }

}
