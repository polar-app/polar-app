import React from 'react';
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {AutocompleteDialogProps} from "../../../../web/js/ui/dialogs/AutocompleteDialog";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUITagInputControls} from "../MUITagInputControls";
import {DialogManager} from "../../../../web/spectron0/material-ui/dialogs/MUIDialogController";

export namespace TaggedCallbacks {

    import toAutocompleteOption = MUITagInputControls.toAutocompleteOption;
    import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;

    interface ITagsBase {
        readonly tags?: Readonly<{[id: string]: Tag}> | undefined;
    }

    export interface TaggedCallbacksOpts<T> {

        /**
         * The items that should be tagged
         */
        readonly targets: () => ReadonlyArray<T>;


        readonly tagsProvider: () => ReadonlyArray<Tag>;

        readonly dialogs: DialogManager;

        readonly doTagged: (targets: ReadonlyArray<T>,
                            tags: ReadonlyArray<Tag>,
                            strategy: ComputeNewTagsStrategy) => void;

    }

    export function create<T extends ITagsBase>(opts: TaggedCallbacksOpts<T>): () => void {

        return () => {

            const {doTagged, dialogs} = opts;

            const targets = opts.targets();

            if (targets.length === 0) {
                console.log("No targets");
                return;
            }

            const availableTags = opts.tagsProvider();

            interface AutocompleteStrategy {
                readonly strategy: ComputeNewTagsStrategy;
                readonly existingTags: ReadonlyArray<Tag>;
                readonly description?: string | JSX.Element;
            }

            function computeAutocompleteStrategy(): AutocompleteStrategy {

                if (targets.length > 1) {

                    return {
                        strategy: 'add',
                        existingTags: [],
                        description: (
                            <>
                                This will <b>ADD</b> the selected tags to <b>{targets.length}</b> items.
                            </>
                        )
                    };


                }

                const annotation = targets[0];

                return {
                    strategy: 'set',
                    existingTags: Object.values(annotation.tags || {}),
                };

            }

            const autocompleteStrategy = computeAutocompleteStrategy();

            const doTaggedWithTimeout = (tags: ReadonlyArray<Tag>) => {
                setTimeout(() => {
                    doTagged(targets, tags, autocompleteStrategy.strategy);
                }, 1);
            }

            const autocompleteProps: AutocompleteDialogProps<Tag> = {
                title: "Assign Tags",
                description: autocompleteStrategy.description,
                options: availableTags.map(toAutocompleteOption),
                defaultOptions: autocompleteStrategy.existingTags.map(toAutocompleteOption),
                createOption: MUITagInputControls.createOption,
                onCancel: NULL_FUNCTION,
                onChange: NULL_FUNCTION,
                onDone: tags => doTaggedWithTimeout(tags)
            };

            dialogs.autocomplete(autocompleteProps);
        }

    }
}
