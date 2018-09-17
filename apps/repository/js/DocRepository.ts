import {IListenablePersistenceLayer} from '../../../web/js/datastore/IListenablePersistenceLayer';
import {Logger} from '../../../web/js/logger/Logger';
import {DocInfo, IDocInfo} from '../../../web/js/metadata/DocInfo';
import {RepoDocInfo} from './RepoDocInfo';
import {Tag} from '../../../web/js/tags/Tag';
import {Tags} from '../../../web/js/tags/Tags';
import {Preconditions} from '../../../web/js/Preconditions';
import {RepoDocInfoIndex} from './RepoDocInfoIndex';
import {TagsDB} from './TagsDB';
import {Optional} from '../../../web/js/util/ts/Optional';

const log = Logger.create();

/**
 * The main interface to the DocRepository including updates, the existing loaded
 * document metadata, and tags database.
 */
export class DocRepository {

    public readonly repoDocs: RepoDocInfoIndex;

    public readonly tagsDB: TagsDB = new TagsDB();

    private readonly persistenceLayer: IListenablePersistenceLayer;

    constructor(persistenceLayer: IListenablePersistenceLayer, repoDocs: RepoDocInfoIndex) {
        this.persistenceLayer = persistenceLayer;
        this.repoDocs = repoDocs;
    }

    /**
     * Update the in-memory representation of this doc.
     *
     * @param repoDocInfo
     */
    public updateDocInfo(repoDocInfo: RepoDocInfo) {
        this.repoDocs[repoDocInfo.fingerprint] = repoDocInfo;

        // update the tags data.
        Optional.of(repoDocInfo.docInfo.tags)
            .map(tags => {
                Object.values(tags).forEach(tag => this.tagsDB.register(tag));
            });

    }

    /**
     * Sync the docInfo to disk.
     *
     * @param docInfo
     */
    public async syncDocInfo(docInfo: IDocInfo) {

        if (await this.persistenceLayer.contains(docInfo.fingerprint)) {

            const docMeta = await this.persistenceLayer.getDocMeta(docInfo.fingerprint);

            if (docMeta === undefined) {
                log.warn("Unable to find DocMeta for: ", docInfo.fingerprint);
                return;
            }

            docMeta.docInfo = new DocInfo(docInfo);

            log.info("Writing out updated DocMeta");

            await this.persistenceLayer.syncDocMeta(docMeta);

        }

    }

    /**
     *
     * @param repoDocInfo
     * @param tags
     */
    public async syncDocInfoTags(repoDocInfo: RepoDocInfo, tags: Tag[]) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(tags);

        repoDocInfo = Object.assign({}, repoDocInfo);
        repoDocInfo.docInfo.tags = Tags.toMap(tags);

        // FIXME: need to send an event so that the UI can refresh since new tags
        // are present.
        this.updateDocInfo(repoDocInfo);

        return this.syncDocInfo(repoDocInfo.docInfo);

    }

}
