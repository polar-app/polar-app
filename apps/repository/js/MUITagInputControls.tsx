import {Tag} from "polar-shared/src/tags/Tags";
import * as React from "react";
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
    };

    export function createOption(input: string): ValueAutocompleteOption<Tag> {
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
