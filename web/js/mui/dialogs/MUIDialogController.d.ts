import { Callback } from "polar-shared/src/util/Functions";
import React from "react";
import { AlertType, ConfirmDialogProps } from "../../ui/dialogs/ConfirmDialog";
import { PromptDialogProps } from "../../ui/dialogs/PromptDialog";
import { AutocompleteDialogProps } from "../../ui/dialogs/AutocompleteDialog";
import { SnackbarDialogProps } from "../../ui/dialogs/SnackbarDialog";
import { TaskbarDialogProps, TaskbarProgressCallback } from "../../ui/dialogs/TaskbarDialog";
import { SelectDialogProps } from "../../ui/dialogs/SelectDialog";
import { InputCompletionType } from "../complete_listeners/InputCompleteListener";
export interface DialogManager {
    confirm: (props: ConfirmDialogProps) => void;
    prompt: (promptDialogProps: PromptDialogProps) => void;
    autocomplete: (autocompleteProps: AutocompleteDialogProps<any>) => void;
    snackbar: (snackbarDialogProps: SnackbarDialogProps) => void;
    taskbar: (taskbarDialogProps: TaskbarDialogProps) => Promise<TaskbarProgressCallback>;
    dialog: (dialogProps: IDialogProps) => void;
    select: <V>(selectProps: SelectDialogProps<V>) => void;
}
export declare const NullDialogManager: DialogManager;
interface IDialogProps {
    readonly title: string;
    readonly body: JSX.Element;
    readonly onCancel?: Callback;
    readonly onAccept: Callback;
    readonly type?: AlertType;
    readonly autoFocus?: boolean;
    readonly cancelText?: string;
    readonly acceptText?: string;
    readonly noCancel?: boolean;
    readonly maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    readonly inputCompletionType?: InputCompletionType;
}
interface IProps {
    readonly children: React.ReactNode;
}
export declare const MUIDialogControllerContext: React.Context<DialogManager>;
export declare const MUIDialogController: React.MemoExoticComponent<(props: IProps) => JSX.Element>;
export {};
