/// <reference types="react" />
import { ValueAutocompleteOption } from "./MUICreatableAutocomplete";
interface IProps<T> {
    readonly relatedOptions: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly onAddRelatedOption: (option: ValueAutocompleteOption<T>) => any;
}
export declare function MUIRelatedOptionsChips<T>(props: IProps<T>): JSX.Element;
export {};
