import {ListenablePersistenceLayer} from '../../../web/js/datastore/ListenablePersistenceLayer';
import {Logger} from '../../../web/js/logger/Logger';
import {DocInfo, IDocInfo} from '../../../web/js/metadata/DocInfo';
import {RepoDocInfo} from './RepoDocInfo';
import {Tag} from '../../../web/js/tags/Tag';
import {Tags} from '../../../web/js/tags/Tags';
import {Preconditions} from '../../../web/js/Preconditions';
import {RepoDocInfoIndex} from './RepoDocInfoIndex';
import {TagsDB} from './TagsDB';
import {Optional} from '../../../web/js/util/ts/Optional';
import {DocMetaFileRefs} from '../../../web/js/datastore/DocMetaRef';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {IProvider} from '../../../web/js/util/Providers';

const log = Logger.create();

/**
 * The main interface to the DocRepository including updates, the existing
 * loaded document metadata, and tags database.
 */
export class RepoDocInfoManager {

    public readonly repoDocInfoIndex: RepoDocInfoIndex = {};

    public readonly tagsDB: TagsDB = new TagsDB();

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    // TODO: a great deal of this code could be cleaned up if I made it MVC and
    // had this data be the model and updated the view via events emitted from
    // an AdvertisingPersistenceLayer - which we kind of need anyway for
    // Firestore....

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.init();
    }

    /**
     * Update the in-memory representation of this doc.
     *
     */
    public updateDocInfo(fingerprint: string, repoDocInfo?: RepoDocInfo) {

        if (repoDocInfo) {
            this.repoDocInfoIndex[fingerprint] = repoDocInfo;
            this.updateTagsDB(repoDocInfo);
        } else {
            delete this.repoDocInfoIndex[fingerprint];
        }

    }

    /**
     * Sync the docInfo to disk.
     *
     */
    public async writeDocInfo(docInfo: IDocInfo) {

        const persistenceLayer = this.persistenceLayerProvider.get();

        if (await persistenceLayer.contains(docInfo.fingerprint)) {

            const docMeta = await persistenceLayer.getDocMeta(docInfo.fingerprint);

            if (docMeta === undefined) {
                log.warn("Unable to find DocMeta for: ", docInfo.fingerprint);
                return;
            }

            docMeta.docInfo = new DocInfo(docInfo);

            log.info("Writing out updated DocMeta");

            await persistenceLayer.writeDocMeta(docMeta);

        }

    }

    /**
     * Update the RepoDocInfo object with the given tags.
     */
    public async writeDocInfoTitle(repoDocInfo: RepoDocInfo, title: string) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(title);

        repoDocInfo = Object.assign({}, repoDocInfo);
        repoDocInfo.title = title;
        repoDocInfo.docInfo.title = title;

        this.updateDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        return this.writeDocInfo(repoDocInfo.docInfo);

    }

    /**
     * Update the RepoDocInfo object with the given tags.
     */
    public async writeDocInfoTags(repoDocInfo: RepoDocInfo, tags: Tag[]) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(tags);

        repoDocInfo = Object.assign({}, repoDocInfo);
        repoDocInfo.tags = Tags.toMap(tags);
        repoDocInfo.docInfo.tags = Tags.toMap(tags);

        this.updateDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        return this.writeDocInfo(repoDocInfo.docInfo);

    }

    public async deleteDocInfo(repoDocInfo: RepoDocInfo) {

        this.updateDocInfo(repoDocInfo.fingerprint);

        const persistenceLayer = this.persistenceLayerProvider.get();

        // delete it from the repo now.
        const docMetaFileRef = DocMetaFileRefs.createFromDocInfo(repoDocInfo.docInfo);

        return persistenceLayer.delete(docMetaFileRef);

    }

    private init() {

        for (const repoDoc of Object.values(this.repoDocInfoIndex)) {
            this.updateTagsDB(repoDoc);
        }

    }

    private updateTagsDB(...repoDocInfos: RepoDocInfo[]) {

        for (const repoDocInfo of repoDocInfos) {

            // update the tags data.
            Optional.of(repoDocInfo.docInfo.tags)
                .map(tags => {
                    this.tagsDB.register(...Object.values(tags));
                });

        }

    }

}
