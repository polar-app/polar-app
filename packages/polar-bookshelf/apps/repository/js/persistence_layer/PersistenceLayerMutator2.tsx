import * as React from "react";
import {useUserTagsDB} from "./UserTagsDataLoader";
import {usePersistenceLayerContext, useRepoDocMetaManager, useTagsProvider} from "./PersistenceLayerApp";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {AnnotationTypes} from "../../../../web/js/metadata/AnnotationTypes";
import {TextHighlights} from "../../../../web/js/metadata/TextHighlights";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {Tag, Tags, TagStr} from "polar-shared/src/tags/Tags";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ProgressCallback, ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {IDStr} from "polar-shared/src/util/Strings";
import { ArrayStreams } from "polar-shared/src/util/ArrayStreams";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {isPresent} from "polar-shared/src/Preconditions";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {IAsyncTransaction} from "polar-shared/src/util/IAsyncTransaction";

export function useCreateTag() {

    const userTags = useUserTagsDB()

    return React.useCallback(async (newTag: TagStr) => {

        userTags.registerWhenAbsent(newTag);
        await userTags.commit();

    }, [userTags]);
}

/**
 * @param deleteTagID the Tag ID to delete
 * @param progressCallback a progress callback
 */
export type DeleteTagAction = (deleteTagID: TagStr, progressCallback?: ProgressCallback) => IAsyncTransaction<void>;

/**
 * Delete a tag permanently and remove the tag from any documents it's on.
 */
export function useDeleteTag(): DeleteTagAction {

    const repoDocMetaManager = useRepoDocMetaManager();
    const userTags = useUserTagsDB()
    const removeTagsFromDocMetas = useRemoveTagsFromDocMetas();
    const tagsProvider = useTagsProvider();

    return React.useCallback((deleteTagID: TagStr,
                              progressCallback: ProgressCallback = NULL_FUNCTION) => {

        const pruneRepoDocManager = () => {

            console.log("Pruning repo doc manager... ");

            repoDocMetaManager.repoDocAnnotationIndex.delete(deleteTagID);
            repoDocMetaManager.repoDocAnnotationIndex.prune();

            repoDocMetaManager.repoDocInfoIndex.delete(deleteTagID);
            repoDocMetaManager.repoDocInfoIndex.prune();

            console.log("Pruning repo doc manager... done");

        }

        const prepare = () => {
            pruneRepoDocManager();
        }

        const commit = (): Promise<void> => {

            const doCommit = async() => {

                const deleteFromUserTags = async () => {

                    console.log("Deleting user tags... ");

                    if (userTags.delete(deleteTagID)) {
                        // noop
                    }

                    await userTags.commit();

                    console.log("Deleting user tags... done");

                };

                const lookupTag = (tag: TagStr): Tag | undefined => {

                    // FIXME: what is the tagsProvider.. ?
                    const tagMap = IDMaps.create(tagsProvider());

                    return tagMap[tag] || {
                        id: tag,
                        label: tag
                    };

                };

                const tagToDelete = lookupTag(deleteTagID);

                if (tagToDelete) {

                    pruneRepoDocManager();

                    console.log("Removing tags from doc metas... ");
                    await removeTagsFromDocMetas(tagToDelete, progressCallback);
                    console.log("Removing tags from doc metas... done");

                    await deleteFromUserTags();

                    pruneRepoDocManager();

                } else {
                    console.warn("Tag does not exist: " + deleteTagID);
                }


            }

            return doCommit();

        }

        return {prepare, commit};


    }, [removeTagsFromDocMetas, repoDocMetaManager.repoDocAnnotationIndex, repoDocMetaManager.repoDocInfoIndex, tagsProvider, userTags])


}

function useRemoveTagsFromDocMetas() {
    const repoDocMetaManager = useRepoDocMetaManager();
    const {persistenceLayerProvider} = usePersistenceLayerContext();

    return React.useCallback(async (deleteTag: Tag,
                                    progressCallback: ProgressCallback = NULL_FUNCTION) => {

        const docsTagged = (tag: Tag): ReadonlyArray<IDStr> => {
            return repoDocMetaManager.repoDocInfoIndex.tagged(tag);
        };

        const docsWithAnnotationsTagged = (tag: Tag): ReadonlyArray<IDStr> => {

            const annotationIndex = repoDocMetaManager.repoDocAnnotationIndex;

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

        const persistenceLayer = persistenceLayerProvider();

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
                    console.log("Skipped annotation without tag: " + docMeta.docInfo.fingerprint, annotation);
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

        console.log("Removed tags from N documents: " + docIDs.length);


    }, [persistenceLayerProvider, repoDocMetaManager.repoDocAnnotationIndex, repoDocMetaManager.repoDocInfoIndex]);

}


export type RenameTagAction = (renameTagID: TagStr,
                               progressCallback?: ProgressCallback) => void;

export function useRenameTag() {

    const repoDocMetaManager = useRepoDocMetaManager();
    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const userTags = useUserTagsDB()
    const tagsProvider = useTagsProvider();

    return React.useCallback(async (renameTagID: TagStr,
                                    progressCallback?: ProgressCallback) => {

        const deleteFromRepoDocManager = () => {
            repoDocMetaManager.repoDocAnnotationIndex.prune();
            repoDocMetaManager.repoDocInfoIndex.prune();
        };

        const renameWithinUserTags = async () => {
            userTags.rename(renameTagID);
            await userTags.commit();
        };

        const lookupTag = (tag: TagStr): Tag | undefined => {

            const tagMap = IDMaps.create(tagsProvider());

            return tagMap[tag] || {
                id: tag,
                label: tag
            };

        };

        const renameTag = lookupTag(renameTagID);

        if (renameTag) {

            // TODO we could generify removeTagsFromDocMEtas
            // TODO: await this.removeTagsFromDocMetas(renameTag, progressCallback);
            // TODO: deleteFromRepoDocManager();

        } else {
            console.warn("Tag does not exist: " + renameTagID);
        }

    }, [repoDocMetaManager.repoDocAnnotationIndex, repoDocMetaManager.repoDocInfoIndex, tagsProvider, userTags]);

}
