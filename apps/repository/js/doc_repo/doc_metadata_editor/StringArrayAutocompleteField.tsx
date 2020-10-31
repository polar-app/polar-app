import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {IField} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { Strings } from "polar-shared/src/util/Strings";
import MUICreatableAutocomplete, {ValueAutocompleteOption} from "../../../../../web/js/mui/autocomplete/MUICreatableAutocomplete";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps extends IField {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly values: ReadonlyArray<string> | undefined;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

export const StringArrayAutocompleteField = deepMemo((props: IProps) => {

    const options: ReadonlyArray<ValueAutocompleteOption<string>> = [
    ];

    const createOption = React.useCallback((label): ValueAutocompleteOption<string> => {
        return {
            id: label,
            label,
            value: label
        }
    }, []);

    return (
        <MUICreatableAutocomplete options={options}
                                  defaultOptions={options}
                                  createOption={createOption}
                                  onChange={NULL_FUNCTION}/>
    );
});
