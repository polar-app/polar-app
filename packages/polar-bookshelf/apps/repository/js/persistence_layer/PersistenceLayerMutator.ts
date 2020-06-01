import {Logger} from "polar-shared/src/logger/Logger";
import {Tag, Tags, TagStr} from "polar-shared/src/tags/Tags";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {AnnotationTypes} from "../../../../web/js/metadata/AnnotationTypes";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {TextHighlights} from "../../../../web/js/metadata/TextHighlights";
import {isPresent} from "polar-shared/src/Preconditions";
import {
    ProgressCallback,
    ProgressTracker
} from "polar-shared/src/util/ProgressTracker";
import {IDStr} from "polar-shared/src/util/Strings";
import {ArrayStreams} from "polar-shared/src/util/ArrayStreams";

const log = Logger.create();

/**
 * Class used to mutate the persistence layer for UI operations like deleting tags, etc.
 */
export class PersistenceLayerMutator {

    public constructor(private readonly repoDocMetaManager: RepoDocMetaManager,
                       private readonly persistenceLayerProvider: PersistenceLayerProvider,
                       private readonly tagsProvider: () => ReadonlyArray<Tag>) {

    }

    public async createTag(newTag: TagStr) {

        const persistenceLayer = this.persistenceLayerProvider();

        const userTagsDB = await persistenceLayer.getUserTagsDB();

        userTagsDB.registerWhenAbsent(newTag);
        await userTagsDB.commit();

    }

    public async deleteTag(deleteTagID: TagStr,
                           progressCallback: ProgressCallback = NULL_FUNCTION) {

        const deleteFromRepoDocManager = () => {
            this.repoDocMetaManager.repoDocAnnotationIndex.prune();
            this.repoDocMetaManager.repoDocInfoIndex.prune();
        };

        const deleteFromUserTags = async () => {
            const persistenceLayer = this.persistenceLayerProvider();
            const userTagsDB = await persistenceLayer.getUserTagsDB();

            if (userTagsDB.delete(deleteTagID)) {
                // noop
            }

            await userTagsDB.commit();
        };

        const lookupTag = (tag: TagStr): Tag | undefined => {

            const tagMap = IDMaps.create(this.tagsProvider());

            return tagMap[tag] || {
                id: tag,
                label: tag
            };

        };

        const deleteTag = lookupTag(deleteTagID);

        if (deleteTag) {

            await this.removeTagsFromDocMetas(deleteTag, progressCallback);
            await deleteFromUserTags();
            deleteFromRepoDocManager();

        } else {
            console.warn("Tag does not exist: " + deleteTagID);
        }

    }

    private async removeTagsFromDocMetas(deleteTag: Tag,
                                         progressCallback: ProgressCallback = NULL_FUNCTION) {

        const docsTagged = (tag: Tag): ReadonlyArray<IDStr> => {
            return this.repoDocMetaManager.repoDocInfoIndex.tagged(tag);
        };

        const docsWithAnnotationsTagged = (tag: Tag): ReadonlyArray<IDStr> => {

            const annotationIndex = this.repoDocMetaManager.repoDocAnnotationIndex;

            const annotationIDs = annotationIndex.tagged(tag);

            return ArrayStreams.create(annotationIDs)
                               .map(annotationID => annotationIndex.get(annotationID))
                               .filter(annotation => isPresent(annotation))
                               .map(annotation => annotation!)
                               .map(annotation => annotation.docInfo.fingerprint)
                               .unique()
                               .collect();
        };

        // these documents use the tag either in the docInfo or the annotations
        // and we will have to og through them and remove the tag everywhere
        const docIDs = [
            ...docsTagged(deleteTag),
            ...docsWithAnnotationsTagged(deleteTag),
        ];

        const persistenceLayer = this.persistenceLayerProvider();

        interface TagMap {
            [id: string]: Tag;
        }

        const computeNewTags = (tags: TagMap | undefined) => {
            const existingTags = Object.values(tags || {});
            return Tags.toMap(Tags.difference(existingTags, [deleteTag]));
        };

        const removeTagsFromDocInfo = (docMeta: IDocMeta) => {
            docMeta.docInfo.tags = computeNewTags(docMeta.docInfo.tags);
        };

        const removeTagsFromAnnotations = (docMeta: IDocMeta) => {

            DocMetas.annotations(docMeta, ((pageMeta, annotation, type) => {

                const hasTag = () => {
                    const tags = (annotation.tags || {});
                    return isPresent(tags[deleteTag.id]);
                };

                if (! hasTag()) {
                    // only apply this to items that actually HAVE the tag.
                    log.notice("Skipped annotation without tag: " + docMeta.docInfo.fingerprint, annotation);
                    return;
                }

                const tags = computeNewTags(annotation.tags);

                if (AnnotationTypes.isTextHighlight(annotation, type)) {
                    const updated = TextHighlights.update(annotation.id,
                                                          docMeta,
                                                          pageMeta,
                                                          {tags});
                }

                if (AnnotationTypes.isAreaHighlight(annotation, type)) {
                    AreaHighlights.update(annotation.id, docMeta, pageMeta, {tags});
                }

                // TODO: comments and flashcards here too.

            }));

        };

        const progressTracker = new ProgressTracker({
            total: docIDs.length,
            id: 'removeTagsFromDocMetas'
        });

        for (const docID of docIDs) {

            const docMeta = await persistenceLayer.getDocMeta(docID);

            if (!docMeta) {
                continue;
            }

            DocMetas.withBatchedMutations(docMeta, () => {

                removeTagsFromDocInfo(docMeta);
                removeTagsFromAnnotations(docMeta);

            });

            await persistenceLayer.writeDocMeta(docMeta);

            progressCallback(progressTracker.incr());

        }

        log.notice("Removed tags from N documents: " + docIDs.length);

    }

}
