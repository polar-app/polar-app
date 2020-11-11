import { Callback, Callback1 } from "polar-shared/src/util/Functions";
export declare function useDialogManager(): import("./MUIDialogController").DialogManager;
export declare function useDeleteConfirmation<T>(onAccept: Callback1<ReadonlyArray<T>>, onCancel?: Callback): (values: ReadonlyArray<T>) => void;
