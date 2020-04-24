import * as React from 'react';
import {AutocompleteDialogProps} from "../../../../web/js/ui/dialogs/AutocompleteDialog";
import {MUITagInputControls} from "../MUITagInputControls";
import {Tag} from "polar-shared/src/tags/Tags";
import {
    DialogManager,
    MUIDialogController
} from "../../../../web/spectron0/material-ui/dialogs/MUIDialogController";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {Provider} from "polar-shared/src/util/Providers";
import toAutocompleteOption = MUITagInputControls.toAutocompleteOption;

interface IProps {
    readonly existingTags: ReadonlyArray<Tag>;
    readonly tagProvider: Provider<ReadonlyArray<Tag>>;
    readonly onTagged: (tags: ReadonlyArray<Tag>) => void;
}

export const AnnotationTagsButton = (props: IProps) => {

    const handleClick = (dialogs: DialogManager) => {

        const availableTags = props.tagProvider();

        const autocompleteProps: AutocompleteDialogProps<Tag> = {
            title: "Assign Tags to Annotation",
            options: availableTags.map(toAutocompleteOption),
            defaultOptions: props.existingTags.map(toAutocompleteOption),
            createOption: MUITagInputControls.createOption,
            onCancel: NULL_FUNCTION,
            onChange: NULL_FUNCTION,
            onDone: tags => props.onTagged(tags)
        };

        dialogs.autocomplete(autocompleteProps);

    };

    return (
        <MUIDialogController>

            {dialogs => (
                <IconButton onClick={() => handleClick(dialogs)}>
                    <LocalOfferIcon/>
                </IconButton>

            )}
        </MUIDialogController>
    );

};
