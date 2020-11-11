import React from "react";
export interface SnackbarDialogProps {
    readonly type?: 'info' | 'success' | 'warning' | 'error';
    readonly message: string;
    readonly autoHideDuration?: number;
    readonly action?: React.ReactNode;
}
export declare const SnackbarDialog: React.MemoExoticComponent<(props: SnackbarDialogProps) => JSX.Element>;
