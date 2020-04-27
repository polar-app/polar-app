import * as React from 'react';
import {useCallback} from 'react';
import {AutocompleteDialogProps} from "../../../../../web/js/ui/dialogs/AutocompleteDialog";
import {MUITagInputControls} from "../../MUITagInputControls";
import {Tag} from "polar-shared/src/tags/Tags";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {Provider} from "polar-shared/src/util/Providers";
import toAutocompleteOption = MUITagInputControls.toAutocompleteOption;
import {useDialogManager} from "../../../../../web/spectron0/material-ui/dialogs/MUIDialogControllers";

interface IProps {
    readonly existingTags: ReadonlyArray<Tag>;
    readonly tagProvider: Provider<ReadonlyArray<Tag>>;
    readonly onTagged: (tags: ReadonlyArray<Tag>) => void;
}

export const AnnotationTagsButton = (props: IProps) => {

    const dialogs = useDialogManager();

    const handleClick = useCallback(() => {

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

    }, [dialogs]);

    return (
        <IconButton onClick={() => handleClick()}>
            <LocalOfferIcon/>
        </IconButton>
    );

};
