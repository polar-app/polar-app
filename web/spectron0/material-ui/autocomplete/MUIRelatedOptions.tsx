import Box from "@material-ui/core/Box";
import * as React from "react";
import {MUIRelatedOptionsChips} from "./MUIRelatedOptionsChips";
import {ValueAutocompleteOption} from "./MUICreatableAutocomplete";

interface IProps<T> {
    readonly relatedOptions: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly onAddRelatedOption: (option: ValueAutocompleteOption<T>) => any;
}

export function MUIRelatedOptions<T>(props: IProps<T>) {

    if (props.relatedOptions.length === 0) {
        return null;
    }

    return <Box>

        <Box pb={1}>
            <strong>Related tags: </strong>
        </Box>

        <MUIRelatedOptionsChips {...props}/>

    </Box>;

};
