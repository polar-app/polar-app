/// <reference types="react" />
import { MUICreatableAutocompleteProps } from "../../mui/autocomplete/MUICreatableAutocomplete";
export interface AutocompleteDialogProps<T> extends MUICreatableAutocompleteProps<T> {
    readonly title?: string;
    readonly description?: string | JSX.Element;
    readonly onCancel: () => void;
    readonly onDone: (values: ReadonlyArray<T>) => void;
}
export declare function AutocompleteDialog<T>(props: AutocompleteDialogProps<T>): JSX.Element;
