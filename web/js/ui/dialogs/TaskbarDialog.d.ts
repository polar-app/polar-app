import React from 'react';
import { Callback1 } from "polar-shared/src/util/Functions";
import { Percentage } from "polar-shared/src/util/ProgressTracker";
export interface ITaskbarProgress {
    readonly value: Percentage | 'indeterminate';
    readonly message?: string;
}
export declare type TaskbarProgressUpdate = ITaskbarProgress | 'terminate';
export declare type TaskbarProgressCallback = (progress: TaskbarProgressUpdate) => void;
export interface TaskbarDialogProps {
    readonly message: string;
    readonly autoHideDuration?: number;
    readonly completedDuration?: number;
    readonly onCancel?: () => void;
    readonly onPause?: () => void;
    readonly onResume?: () => void;
    readonly noAutoTerminate?: boolean;
}
export interface TaskbarDialogPropsWithCallback extends TaskbarDialogProps {
    readonly onProgressCallback: Callback1<TaskbarProgressCallback>;
}
export declare const TaskbarDialog: React.MemoExoticComponent<(props: TaskbarDialogPropsWithCallback) => JSX.Element>;
