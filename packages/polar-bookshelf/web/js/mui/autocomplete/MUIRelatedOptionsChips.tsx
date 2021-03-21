import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import * as React from "react";
import {ValueAutocompleteOption} from "./MUICreatableAutocomplete";

interface IProps<T> {
    readonly relatedOptions: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly onAddRelatedOption: (option: ValueAutocompleteOption<T>) => any;
}

export function MUIRelatedOptionsChips<T>(props: IProps<T>) {

    return (
        <Grid container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={1}>
            {props.relatedOptions.map(option =>
                <Grid item
                      key={option.id}>
                    <Chip label={option.label}
                          size="small"
                          onClick={() => props.onAddRelatedOption(option)}/>
                </Grid>)}
        </Grid>
    );

};
