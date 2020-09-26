import React from 'react';
import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import {useComponentDidMount} from "../../hooks/ReactLifecycleHooks";
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import {deepMemo} from "../../react/ReactUtils";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export interface ITaskbarProgress {

    readonly value: Percentage | 'indeterminate';

    /**
     * Specify an optional message.  If no new message is given the existing
     * one is preserved.
     */
    readonly message?: string;

}

export type TaskbarProgressUpdate = ITaskbarProgress | 'terminate';

// TODO: need a cancel button ...
// TODO: needs pause / resume functionality...
export type TaskbarProgressCallback = (progress: TaskbarProgressUpdate) => void;

export interface TaskbarDialogProps {

    /**
     * Initial message for the TaskBar.
     */
    readonly message: string;

    readonly autoHideDuration?: number;

    readonly completedDuration?: number;

    /**
     * When given, we enable this taskbar to be cancellable and the user can trigger the task to abort
     * and onCancel is then called.
     */
    readonly onCancel?: () => void;

    readonly onPause?: () => void;

    readonly onResume?: () => void;

    /**
     * Buy default, we auto-terminate when the task reaches 100%. This disables this feature so we can wait for
     * a terminate message.
     */
    readonly noAutoTerminate?: boolean;

}

export interface TaskbarDialogPropsWithCallback extends TaskbarDialogProps {

    // called once after init so that we can tell the caller about the progress
    // callback we created
    readonly onProgressCallback: Callback1<TaskbarProgressCallback>;
}

/**
 * Like a Snackbar but it includes progress...
 */
export const TaskbarDialog = deepMemo((props: TaskbarDialogPropsWithCallback) => {

    const [progress, setProgress] = React.useState<ITaskbarProgress>({value: 0, message: props.message});
    const [open, setOpen] = React.useState(true);

    function setProgressCallback(updateProgress: TaskbarProgressUpdate) {

        function doTerminate() {
            setTimeout(() => setOpen(false), props.completedDuration || 1000);
        }

        if (updateProgress === 'terminate') {
            doTerminate();
            return;
        }

        if (! props.noAutoTerminate && updateProgress.value === 100) {
            // close the task but only after a delay so that the user sees that
            // it finished.
            doTerminate();
            return;
        }

        const newProgress = {
            ...updateProgress,
            message: updateProgress.message ? updateProgress.message : progress.message
        }

        setProgress(newProgress);


    }

    useComponentDidMount(() => {
        props.onProgressCallback(setProgressCallback);
    });

    const Progress = () => {

        if (progress.value === 'indeterminate') {
            return <CircularProgress />;
        } else {
            return <CircularProgress variant="static" value={progress.value}/>
        }

    };

    const Action = () => {
        return (
            <>
                <Progress/>

                {props.onCancel && (
                    <IconButton onClick={props.onCancel}>
                        <CloseIcon/>
                    </IconButton>
                )}
            </>
        );
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={props.autoHideDuration || 5000}
            onClose={NULL_FUNCTION}
            message={props.message}
            action={<Action/>}/>
    );

});
