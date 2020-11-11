/// <reference types="react" />
import { IDStr } from "polar-shared/src/util/Strings";
export interface ISelectOption<V> {
    readonly id: IDStr;
    readonly label: string;
    readonly value: V;
}
export interface SelectDialogProps<V> {
    readonly title: string;
    readonly description?: string;
    readonly options: ReadonlyArray<ISelectOption<V>>;
    readonly defaultValue?: IDStr;
    readonly onCancel: () => void;
    readonly onDone: (selected: ISelectOption<V>) => void;
}
export declare const SelectDialog: <V>(props: SelectDialogProps<V>) => JSX.Element;
