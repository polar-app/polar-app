import React from 'react';
import { Callback } from "polar-shared/src/util/Functions";
import { InputCompletionType } from "../../mui/complete_listeners/InputCompleteListener";
export declare type AlertType = 'danger' | 'error' | 'warning' | 'success' | 'info' | 'none';
export interface ConfirmDialogProps {
    readonly title: string;
    readonly subtitle: string | JSX.Element;
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
export declare const ConfirmDialog: React.MemoExoticComponent<(props: ConfirmDialogProps) => JSX.Element>;
