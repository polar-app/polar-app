import {IListenablePersistenceLayer} from '../../../web/js/datastore/IListenablePersistenceLayer';
import {Logger} from '../../../web/js/logger/Logger';
import {DocInfo, IDocInfo} from '../../../web/js/metadata/DocInfo';
import {RepoDocInfo} from './RepoDocInfo';
import {Tag} from '../../../web/js/tags/Tag';
import {Tags} from '../../../web/js/tags/Tags';
import {Preconditions} from '../../../web/js/Preconditions';

const log = Logger.create();

/**
 * Update the repo with the latest DocInfo when we make changes.
 */
export class RepositoryUpdater {

    private readonly persistenceLayer: IListenablePersistenceLayer;

    constructor(persistenceLayer: IListenablePersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    public async updateDocInfo(docInfo: IDocInfo) {

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

    public async updateTags(repoDocInfo: RepoDocInfo, tags: Tag[]) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(tags);

        const docInfo: IDocInfo = Object.assign({}, repoDocInfo.docInfo);
        docInfo.tags = Tags.toMap(tags);

        console.log("FIXME", docInfo);

        return this.updateDocInfo(docInfo);

    }

}
