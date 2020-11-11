/// <reference types="react" />
import { ValueAutocompleteOption } from "./MUICreatableAutocomplete";
interface IProps<T> {
    readonly relatedOptions: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly onAddRelatedOption: (option: ValueAutocompleteOption<T>) => any;
}
export declare function MUIRelatedOptions<T>(props: IProps<T>): JSX.Element | null;
export {};
