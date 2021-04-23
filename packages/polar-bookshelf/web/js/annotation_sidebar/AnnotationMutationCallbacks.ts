import * as React from "react";
import {
    Callback,
    Callback1,
} from "polar-shared/src/util/Functions";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {
    usePersistenceLayerContext,
    useRepoDocMetaManager,
    useTagsContext
} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {
    AreaHighlights,
    AreaHighlightWriteOpts
} from "../metadata/AreaHighlights";
import {AreaHighlightRects} from "../metadata/AreaHighlightRects";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useDocMetaLookupContext} from "./DocMetaLookupContextProvider";
import {
    IAnnotationRef,
    IAnnotationRefWithDocMeta
} from "polar-shared/src/metadata/AnnotationRefs";
import {useLogger} from "../mui/MUILogger";
import {Preconditions} from "polar-shared/src/Preconditions";
import {DocMetas} from "../metadata/DocMetas";

import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;
import TaggedCallbacksOpts = TaggedCallbacks.TaggedCallbacksOpts;
import ITagsHolder = TaggedCallbacks.ITagsHolder;
import {
    IAnnotationMutationCallbacks,
    IAnnotationMutationSelectedWithDocMeta,
    IAnnotationMutationSelected,
    IAnnotationMutationHolderWithDocMeta,
    IAnnotationMutationHolder,
    ITaggedMutation,
    IDeleteMutation,
    IDeleteMutationWithDocMeta,
    DocAnnotationsMutator,
    IAreaHighlightMutation, ITextHighlightMutation, ICommentMutation, IFlashcardMutation, IColorMutation
} from "./AnnotationMutationsContext";
import {Analytics} from "../analytics/Analytics";

/**
 * @param updateStore: Update the store directly.
 * @param refresher called for each mutation to update the store.
 */
export type AnnotationMutationCallbacksFactory = (updateStore: (docMetas: ReadonlyArray<IDocMeta>) => ReadonlyArray<IDocMeta>,
                                                  refresher: () => void) => IAnnotationMutationCallbacks;

export function useAnnotationMutationCallbacksFactory(): AnnotationMutationCallbacksFactory {

    const dialogs = useDialogManager();
    const persistenceLayerContext = usePersistenceLayerContext();
    const docMetaLookupContext = useDocMetaLookupContext();
    const tagsContext = useTagsContext();
    const repoDocMetaManager = useRepoDocMetaManager();
    const log = useLogger();

    return React.useCallback((updateStore, refresher) => {

        async function writeUpdatedDocMetas(updatedDocMetas: ReadonlyArray<IDocMeta>) {

            updatedDocMetas = updatedDocMetas.map(DocMetas.updated)

            updatedDocMetas = updateStore(updatedDocMetas);

            refresher();

            const {persistenceLayerProvider} = persistenceLayerContext;

            // TODO: I think this is wrong as we have to update the stores
            // in the doc viewer and repoDocInfo... so I think we would need
            // to update those...

            for (const docMeta of updatedDocMetas) {
                const persistenceLayer = persistenceLayerProvider();
                await persistenceLayer.writeDocMeta(docMeta);
            }

        }

        type AnnotationMutator<T extends IAnnotationMutationSelectedWithDocMeta> = (docMeta: IDocMeta,
                                                                                    pageMeta: IPageMeta,
                                                                                    mutation: T) => void;

        /**
         *
         * @Deprecated migrate to handleUpdate2 and using IAnnotationMutationHolder
         * @param mutation The mutation to execute along with the annotations.
         * @param annotationMutator The mutator to mutate the annotations.
         */
        async function handleUpdate<T extends IAnnotationMutationSelected>(mutation: T,
                                                                           annotationMutator: AnnotationMutator<T & IAnnotationMutationSelectedWithDocMeta>) {

            const selected = docMetaLookupContext.lookupAnnotations(mutation.selected);

            const partitions = arrayStream(selected)
                .partition(annotation => [annotation.docMetaRef.id, docMetaLookupContext.lookup(annotation.docMetaRef.id)!]);

            // *** first we have to apply all the mutations to every annotation in
            // this doc...
            for (const partition of Object.values(partitions)) {
                const docMeta = partition.key;

                for (const annotation of selected) {
                    const pageMeta = DocMetas.getPageMeta(docMeta, annotation.pageNum);
                    annotationMutator(docMeta, pageMeta, {
                        ...mutation,
                        selected: [annotation]
                    });
                }

            }

            // *** now we have to update the store

            const updatedDocMetas = Object.values(partitions)
                .map(current => current.key);

            await writeUpdatedDocMetas(updatedDocMetas);

        }

        type AnnotationMutator2<M> = (mutation: IAnnotationMutationHolderWithDocMeta<M>) => void;

        /**
         *
         */
        async function handleUpdate2<M>(holders: ReadonlyArray<IAnnotationMutationHolder<M>>,
                                        annotationMutator: AnnotationMutator2<M>) {

            const resolvedHolders = docMetaLookupContext.lookupAnnotationHolders(holders);

            for (const resolvedHolder of resolvedHolders) {
                annotationMutator(resolvedHolder);
            }

            // *** now we have to update the store

            const updatedDocMetas = Object.values(resolvedHolders)
                .map(current => current.annotation.docMeta);

            await writeUpdatedDocMetas(updatedDocMetas);

        }



        function doTagged(annotations: ReadonlyArray<IAnnotationRef>,
                          tags: ReadonlyArray<Tag>,
                          strategy: ComputeNewTagsStrategy = 'set') {

            handleUpdate({selected: annotations}, (docMeta, pageMeta, mutation) => {

                for (const current of mutation.selected) {

                    const newTags = Tags.computeNewTags(current.original.tags, tags, strategy);

                    const updates = {
                        tags: Tags.toMap(newTags)
                    };

                    AnnotationMutations.update({...current, docMeta},
                        {...current.original, ...updates});

                }

            }).catch(err => log.error(err));

        }

        function createTaggedCallback(mutation: ITaggedMutation) {

            function toTarget(annotation: IAnnotationRef): IAnnotationRef & ITagsHolder {

                return {
                    ...annotation,
                    tags: annotation.original.tags
                }

            }

            function buildRelatedOptionsCalculator() {

                if (repoDocMetaManager) {
                    const {relatedTagsManager} = repoDocMetaManager;
                    return relatedTagsManager.toRelatedOptionsCalculator();
                }

                return undefined;

            }

            const relatedOptionsCalculator = buildRelatedOptionsCalculator();

            const opts: TaggedCallbacksOpts<IAnnotationRef & ITagsHolder> = {
                targets: () => mutation.selected.map(toTarget),
                tagsProvider: tagsContext.tagsProvider,
                dialogs,
                doTagged,
                relatedOptionsCalculator
            }

            return TaggedCallbacks.create(opts);

        }

        function onTagged(mutation: ITaggedMutation) {
            createTaggedCallback(mutation)();
        }

        function useDeletedCallback(mutation: IDeleteMutation): Callback {

            return React.useCallback(() => {
                onDeleted(mutation);
            }, [mutation]);

        }

        function onDeleted(mutation: IDeleteMutation) {

            const annotations = docMetaLookupContext.lookupAnnotations(mutation.selected);

            if (annotations.length === 0) {
                log.warn("no repoAnnotation");
                return;
            }

            dialogs.confirm({
                title: "Are you sure you want to delete this item?",
                subtitle: "This is a permanent operation and can't be undone.",
                onAccept: () => doDeleted(annotations)
            })

        }

        function doDeleted(annotations: ReadonlyArray<IAnnotationRefWithDocMeta>) {

            const mutation: IDeleteMutationWithDocMeta = {
                selected: docMetaLookupContext.lookupAnnotations(annotations)
            }

            handleUpdate(mutation, DocAnnotationsMutator.onDeleted)
                .catch(err => log.error(err));

        }

        function onAreaHighlight(mutation: IAreaHighlightMutation) {

            async function doAsync() {

                const {docMeta, pageMeta, areaHighlight, capturedScreenshot, position} = mutation;

                Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot')

                function toAreaHighlightRect() {
                    const rect = Arrays.first(Object.values(areaHighlight.rects));
                    return AreaHighlightRects.createFromRect(rect!);
                }

                const areaHighlightRect = toAreaHighlightRect();

                // this will do the actual mutation of the docMeta
                // DocAnnotationsMutator.onAreaHighlight(mutation.docMeta, mutation.pageMeta, mutation);

                const {persistenceLayerProvider} = persistenceLayerContext;

                const writeOpts: AreaHighlightWriteOpts = {
                    datastore: persistenceLayerProvider(),
                    docMeta,
                    pageMeta,
                    areaHighlight,
                    areaHighlightRect,
                    position,
                    capturedScreenshot
                };

                const writer = AreaHighlights.createWriter(writeOpts);

                const [, committer] = writer.prepare();

                updateStore([docMeta]);

                await committer.commit();

                updateStore([docMeta]);

                refresher();

                if (mutation.type === "create") {
                    Analytics.event2('doc-highlightCreated', { type: 'area' });
                }
            }

            doAsync()
                .catch(err => log.error(err));

        }

        function onTextHighlight(mutation: ITextHighlightMutation) {

            switch (mutation.type) {

                case "revert":
                case "update":
                    handleUpdate(mutation, DocAnnotationsMutator.onTextHighlight)
                        .catch(err => log.error(err));
                    break;

                case "create":

                    const {docMeta, pageMeta, textHighlight} = mutation;
                    pageMeta.textHighlights[textHighlight.id] = textHighlight;

                    writeUpdatedDocMetas([docMeta])
                        .then(() => Analytics.event2('doc-highlightCreated', { type: 'text' }))
                        .catch(err => log.error(err));

                    break;


            }

        }

        function createCommentCallback(annotation: IAnnotationRef): Callback1<ICommentMutation> {

            // eslint-disable-next-line
            return React.useCallback((mutation: ICommentMutation) => {

                const holder: IAnnotationMutationHolder<ICommentMutation> = {
                    annotation,
                    mutation
                }

                onComment([holder]);

            }, [annotation]);

        }

        function onComment(holders: ReadonlyArray<IAnnotationMutationHolder<ICommentMutation>>) {

            handleUpdate2(holders, DocAnnotationsMutator.onComment)
                .catch(err => log.error(err));

        }

        // TODO should be useFlashcardCallback
        function createFlashcardCallback(annotation: IAnnotationRef): Callback1<IFlashcardMutation> {

            // eslint-disable-next-line
            return React.useCallback((mutation: IFlashcardMutation) => {

                const holder: IAnnotationMutationHolder<IFlashcardMutation> = {
                    annotation,
                    mutation
                }

                onFlashcard([holder]);

            }, [annotation]);

        }

        function onFlashcard(holders: ReadonlyArray<IAnnotationMutationHolder<IFlashcardMutation>>) {

            handleUpdate2(holders, DocAnnotationsMutator.onFlashcard)
                .catch(err => log.error(err));

        }

        function createColorCallback(selected: IAnnotationMutationSelected): Callback1<IColorMutation> {

            // eslint-disable-next-line
            return React.useCallback((mutation: IColorMutation) => {
                onColor({...selected, ...mutation});
            }, [selected]);

        }

        function onColor(colorMutation: IColorMutation & IAnnotationMutationSelected) {

            handleUpdate({selected: colorMutation.selected}, (docMeta, pageMeta, mutation) => {

                for (const current of mutation.selected) {

                    const updates = {
                        color: colorMutation.color
                    };

                    AnnotationMutations.update({...current, docMeta},
                        {...current.original, ...updates});

                }

                Analytics.event2('annotation-colorChanged');
            }).catch(err => log.error(err));

        }

        return {
            writeUpdatedDocMetas,
            createDeletedCallback: useDeletedCallback,
            onDeleted,
            onAreaHighlight,
            onTextHighlight,
            createCommentCallback,
            onComment,
            createFlashcardCallback,
            onFlashcard,
            createColorCallback,
            onColor,
            createTaggedCallback,
            doTagged,
            onTagged,
        };

    },
    [dialogs, persistenceLayerContext, docMetaLookupContext, tagsContext, repoDocMetaManager, log]);

}

