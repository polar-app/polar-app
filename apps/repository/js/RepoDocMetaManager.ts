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
import {RepoAnnotation} from './RepoAnnotation';
import {RepoDocMeta} from './RepoDocMeta';
import {RelatedTags} from '../../../web/js/tags/related/RelatedTags';
import {Sets} from '../../../web/js/util/Sets';

const log = Logger.create();

export interface RepoAnnotationIndex {
    [id: string]: RepoAnnotation;
}

/**
 * The main interface to the DocRepository including updates, the existing
 * loaded document metadata, and tags database.
 */
export class RepoDocMetaManager {

    public readonly repoDocInfoIndex: RepoDocInfoIndex = {};

    public readonly repoAnnotationIndex: RepoAnnotationIndex = {};

    public readonly tagsDB = new TagsDB();

    public readonly relatedTags = new RelatedTags();

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.init();
    }

    public updateFromRepoDocMeta(fingerprint: string, repoDocMeta?: RepoDocMeta) {

        if (repoDocMeta) {

            this.repoDocInfoIndex[fingerprint] = repoDocMeta.repoDocInfo;
            this.updateTagsDB(repoDocMeta.repoDocInfo);

            this.relatedTags.update(fingerprint, 'set', ...Object.values(repoDocMeta.repoDocInfo.tags || {})
                                                                 .map(current => current.label));

            const updateAnnotations = () => {

                const deleteOrphaned = () => {

                    const currentAnnotationsIDs = Object.values(this.repoAnnotationIndex)
                        .filter(current => current.fingerprint === repoDocMeta.repoDocInfo.fingerprint)
                        .map(current => current.id);

                    const newAnnotationIDs = repoDocMeta.repoAnnotations
                        .map(current => current.id);

                    const deleteIDs = Sets.difference(currentAnnotationsIDs, newAnnotationIDs);

                    for (const deleteID of deleteIDs) {
                        delete this.repoAnnotationIndex[deleteID];
                    }

                };

                const updateExisting = () => {

                    for (const repoAnnotation of repoDocMeta.repoAnnotations) {
                        this.repoAnnotationIndex[repoAnnotation.id] = repoAnnotation;
                    }

                };

                deleteOrphaned();
                updateExisting();

            };

            updateAnnotations();

        } else {

            const deleteOrphanedAnnotations = () => {

                // now delete stale repo annotations.
                for (const repoAnnotation of Object.values(this.repoAnnotationIndex)) {

                    if (repoAnnotation.fingerprint === fingerprint) {
                        delete this.repoAnnotationIndex[repoAnnotation.id];
                    }
                }

            };

            const deleteDoc = () => {
                delete this.repoDocInfoIndex[fingerprint];
            };

            deleteOrphanedAnnotations();
            deleteDoc();

        }

    }

    /**
     * Update the in-memory representation of this doc.
     *
     */
    public updateFromRepoDocInfo(fingerprint: string, repoDocInfo?: RepoDocInfo) {

        if (repoDocInfo) {
            this.repoDocInfoIndex[fingerprint] = repoDocInfo;
            this.updateTagsDB(repoDocInfo);
        } else {
            delete this.repoDocInfoIndex[fingerprint];
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

        repoDocInfo = {...repoDocInfo, title};
        repoDocInfo.docInfo.title = title;

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        return this.writeDocInfo(repoDocInfo.docInfo);

    }

    /**
     * Update the RepoDocInfo object with the given tags.
     */
    public async writeDocInfoTags(repoDocInfo: RepoDocInfo, tags: Tag[]) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(tags);

        repoDocInfo = {...repoDocInfo, tags: Tags.toMap(tags)};
        repoDocInfo.docInfo.tags = Tags.toMap(tags);

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        return this.writeDocInfo(repoDocInfo.docInfo);

    }

    public async deleteDocInfo(repoDocInfo: RepoDocInfo) {

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint);

        const persistenceLayer = this.persistenceLayerProvider.get();

        // delete it from the repo now.
        const docMetaFileRef = DocMetaFileRefs.createFromDocInfo(repoDocInfo.docInfo);

        await persistenceLayer.delete(docMetaFileRef);

    }

    private init() {
        // TODO: is this even needed anymore?

        for (const repoDocInfo of Object.values(this.repoDocInfoIndex)) {
            this.updateTagsDB(repoDocInfo);
        }

    }


}
