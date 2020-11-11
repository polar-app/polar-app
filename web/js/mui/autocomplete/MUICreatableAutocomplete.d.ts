import React from 'react';
export interface ValueAutocompleteOption<T> {
    readonly id: string;
    readonly label: string;
    readonly value: T;
}
export declare type RelatedOptionsCalculator<T> = (options: ReadonlyArray<ValueAutocompleteOption<T>>) => ReadonlyArray<ValueAutocompleteOption<T>>;
export interface MUICreatableAutocompleteProps<T> {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly label?: string;
    readonly options: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly defaultOptions?: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly placeholder?: string;
    readonly autoFocus?: boolean;
    readonly createOption: (label: string) => ValueAutocompleteOption<T>;
    readonly onChange: (selected: ReadonlyArray<T>) => void;
    readonly relatedOptionsCalculator?: RelatedOptionsCalculator<T>;
    readonly onOpen?: (open: boolean) => void;
}
export default function MUICreatableAutocomplete<T>(props: MUICreatableAutocompleteProps<T>): JSX.Element;
