import * as React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";
import {ValueAutocompleteOption} from "../../../web/js/mui/autocomplete/MUICreatableAutocomplete";

export namespace MUITagInputControls {

    export function toAutocompleteOption(tag: Tag): ValueAutocompleteOption<Tag> {

        return {
            id: tag.id,
            label: tag.label,
            value: {
                id: tag.id,
                label: tag.label,
            }
        };

    }

    export function createOption(input: string): ValueAutocompleteOption<Tag> {

        // trim the input so that if the user enters a space its is trimmed as tags that
        // end with strings don't make any sense.
        input = input.trim();

        return {
            id: input,
            label: input,
            value: {
                id: input,
                label: input,
            }
        };

    }

}
