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
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {RepoDocAnnotations} from "../RepoDocAnnotations";
import {toSelfInheritedTags} from "polar-shared/src/tags/InheritedTags";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {Comments} from "../../../../web/js/metadata/Comments";
import {Flashcards} from "../../../../web/js/metadata/Flashcards";

export function useCreateTag() {

    const userTags = useUserTagsDB()

    return React.useCallback(async (newTag: TagStr) => {

        userTags.registerWhenAbsent(newTag);
        await userTags.commit();

    }, [userTags]);
}

interface TagMap {
    [id: string]: Tag;
}

const lookupTag = (tags: ReadonlyArray<Tag>, tag: TagStr): Tag => {
    const tagMap = IDMaps.create(tags);

    return tagMap[tag] || {
        id: tag,
        label: tag
    };
};

/**
 * @param deleteTagID the Tag ID to delete
 * @param progressCallback a progress callback
 */
export type DeleteTagAction = (deleteTagID: TagStr, progressCallback?: ProgressCallback) => IAsyncTransaction<void>;

/**
 * Delete a tag permanently and remove the tag from any documents it's on.
 */
export function useDeleteTag(): DeleteTagAction {
    const tagsProvider = useTagsProvider();
    const renameTag = useRenameTag();

    return React.useCallback((deleteTagID: TagStr,
                              progressCallback: ProgressCallback = NULL_FUNCTION) => {

        const tagToDelete = lookupTag(tagsProvider(), deleteTagID);
        const remover = renameTag(tagToDelete, null, progressCallback);

        return remover;
    }, [renameTag, tagsProvider])
}

type TagMutationType = 'remove' | 'add';

interface TagMutation extends Tag {
    mutationType: TagMutationType;
}

const filterTagMutations = (mutations: ReadonlyArray<TagMutation>, type: TagMutationType): ReadonlyArray<Tag> =>
    mutations
        .filter(({ mutationType }) => mutationType === type)
        .map(({ mutationType, ...origTag }) => origTag);

const computeNewTags = (tags: TagMap | undefined, mutations: ReadonlyArray<TagMutation>): TagMap => {
    const existingTags = Object.values(tags || {});
    const toBeDeleted = filterTagMutations(mutations, 'remove');
    const toBeAdded = filterTagMutations(mutations, 'add');
    return Tags.toMap(
        Tags.union(
            Tags.difference(existingTags, toBeDeleted),
            toBeAdded,
        )
    );
};

export type IAnnotationType = ITextHighlight | IAreaHighlight | IFlashcard | IComment;

const setAnnotationTags = (
    docMeta: IDocMeta,
    tagMutations: ReadonlyArray<TagMutation>,
    predicate: (annotation: IAnnotationType | IDocAnnotation) => boolean,
) => {
    DocMetas.annotations(docMeta, ((pageMeta, annotation, type) => {
        if (!predicate(annotation)) {
            return;
        }
        const tags = computeNewTags(annotation.tags, tagMutations);

        if (AnnotationTypes.isTextHighlight(annotation, type)) {
            TextHighlights.update(annotation.id,
                docMeta,
                pageMeta,
                {tags}
            );
        }

        if (AnnotationTypes.isAreaHighlight(annotation, type)) {
            AreaHighlights.update(annotation.id, docMeta, pageMeta, {tags});
        }

        if (AnnotationTypes.isComment(annotation, type)) {
            Comments.update(annotation.id, docMeta, pageMeta, {tags});
        }

        if (AnnotationTypes.isFlashcard(annotation, type)) {
            Flashcards.update(annotation.id, docMeta, pageMeta, {tags});
        }
    }));
};

const setDocInfoTags = (docMeta: IDocMeta, tagMutations: ReadonlyArray<TagMutation>) => {
    docMeta.docInfo.tags = computeNewTags(docMeta.docInfo.tags, tagMutations);
};

export type RenameTagAction = (renameTagID: Tag,
                               newName: Tag | null,
                               progressCallback?: ProgressCallback) => IAsyncTransaction<void>;


export function useRenameTag(): RenameTagAction  {

    const repoDocMetaManager = useRepoDocMetaManager();
    const userTags = useUserTagsDB();
    const {persistenceLayerProvider} = usePersistenceLayerContext();

    return React.useCallback((oldTag: Tag,
                              newTag: Tag | null,
                              progressCallback: ProgressCallback = NULL_FUNCTION) => {


        const persistenceLayer = persistenceLayerProvider();

        const docsWithAnnotationsTagged = (): ReadonlyArray<IDStr> => {
            const annotationIndex = repoDocMetaManager.repoDocAnnotationIndex;
            const annotationIDs = annotationIndex.tagged(oldTag);

            return ArrayStreams.create(annotationIDs)
                .map(annotationID => annotationIndex.get(annotationID))
                .filter(annotation => isPresent(annotation))
                .map(annotation => annotation!)
                .map(annotation => annotation.docInfo.fingerprint)
                .unique()
                .collect();
        };

        const docIDs = repoDocMetaManager.repoDocInfoIndex.tagged(oldTag);
        const annotationsDocIDs = docsWithAnnotationsTagged();


        const docsIDsSet = new Set(docIDs);
        const annotationDocIDsSet = new Set(annotationsDocIDs);

        const mergedDocIDs = ArrayStreams.create([...annotationsDocIDs, ...docIDs]).unique().collect();

        const tagMutations: TagMutation[] = [{ ...oldTag, mutationType: 'remove' }];

        userTags.delete(oldTag.id);
        if (newTag) {
            tagMutations.push({ ...newTag, id: newTag.label, mutationType: 'add' });
            userTags.register(newTag);
        }

        const annotationPredicate = (annotation: IAnnotationType | IDocAnnotation) => {
            const tags = (annotation.tags || {});
            return isPresent(tags[oldTag.id]);
        };

        const prepare = () => {
            for (const docID of mergedDocIDs) {
                let repoDocInfo = repoDocMetaManager.repoDocInfoIndex.get(docID);

                if (!repoDocInfo) {
                    continue;
                }

                if (docsIDsSet.has(docID)) {
                    repoDocInfo = { ...repoDocInfo, tags: computeNewTags(repoDocInfo.docMeta.docInfo.tags, tagMutations) };
                }

                if (annotationDocIDsSet.has(docID)) {
                    const annotations = RepoDocAnnotations.convert(persistenceLayerProvider, repoDocInfo.docMeta)
                        .filter(annotationPredicate);

                    // Update the in-memory tags for annotations
                    for (const annotation of annotations) {
                        repoDocMetaManager.repoDocAnnotationIndex.delete(annotation.id);
                        repoDocMetaManager.repoDocAnnotationIndex.put(annotation.id, {
                            ...annotation,
                            tags: toSelfInheritedTags(computeNewTags(annotation.tags, tagMutations)),
                        });
                    }
                }
                // Update the in-memory tags for docs
                repoDocMetaManager.repoDocInfoIndex.delete(docID);
                repoDocMetaManager.repoDocInfoIndex.put(docID, repoDocInfo);
            }
            repoDocMetaManager.repoDocInfoIndex.prune();
            repoDocMetaManager.repoDocAnnotationIndex.prune();
        };

        const progressTracker = new ProgressTracker({
            total: mergedDocIDs.length,
            id: 'updateTagsInDocMetas'
        });

        const commit =  async () => {

            for (const docID of mergedDocIDs) {
                const docMeta = await persistenceLayer.getDocMeta(docID);

                if (!docMeta) {
                    continue;
                }

                DocMetas.withBatchedMutations(docMeta, () => {
                    if (docsIDsSet.has(docID)) {
                        setDocInfoTags(docMeta, tagMutations);
                    }
                    if (annotationDocIDsSet.has(docID)) {
                        setAnnotationTags(docMeta, tagMutations, annotationPredicate);
                    }
                });

                await persistenceLayer.writeDocMeta(docMeta);
                
                progressCallback(progressTracker.incr());
            }

            await userTags.commit();
        };

        return { prepare, commit };

    }, [repoDocMetaManager.repoDocAnnotationIndex, repoDocMetaManager.repoDocInfoIndex, userTags, persistenceLayerProvider]);

}
