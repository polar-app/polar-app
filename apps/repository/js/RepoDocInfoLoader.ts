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

    public async loadDocMetaFile(docMetaRef: DocMetaRef): Promise<RepoDocInfo | undefined> {

        let docMeta: DocMeta | undefined;

        try {
            docMeta = await this.persistenceLayer!.getDocMeta(docMetaRef.fingerprint);
        } catch (e) {
            log.error("Unable to load DocMeta for " + docMetaRef.fingerprint, e);
        }

        if (docMeta !== undefined) {

            if (docMeta.docInfo) {

                return RepoDocInfos.convertFromDocInfo(docMeta.docInfo);

            } else {
                log.warn("No docInfo for file: ", docMetaRef.fingerprint);
            }

        } else {
            log.warn("No DocMeta for fingerprint: " + docMetaRef.fingerprint);
        }

        return undefined;

    }

    private async loadFromPersistenceLayer(): Promise<RepoDocInfoIndex> {

        const result: RepoDocInfoIndex = {};

        const docMetaFiles = await this.persistenceLayer!.getDocMetaFiles();

        const progress = new Progress(docMetaFiles.length);

        const progressBar = ProgressBar.create(false);

        for (const docMetaFile of docMetaFiles) {

            const repoDocInfo = await this!.loadDocMetaFile(docMetaFile);

            if (repoDocInfo) {
                result[repoDocInfo.fingerprint] = repoDocInfo;
            }

            progress.incr();
            progressBar.update(progress.percentage());

        }

        progressBar.destroy();

        return result;
    }

    /**
     * Some of our documents might be broken and we should filter them to not
     * break the UI.
     *
     * @param repoDocInfoIndex
     */
    private async filterInvalid(repoDocInfoIndex: RepoDocInfoIndex) {

        const filtered = Object.values(repoDocInfoIndex).filter(current => RepoDocInfos.isValid(current));

        return Dictionaries.toDict(filtered, (value) => value.fingerprint);

    }

}
