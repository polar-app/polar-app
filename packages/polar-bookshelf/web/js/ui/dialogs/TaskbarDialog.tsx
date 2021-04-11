import React from 'react';
import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import {useComponentDidMount} from "../../hooks/ReactLifecycleHooks";
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import {deepMemo} from "../../react/ReactUtils";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {useStateRef} from "../../hooks/ReactHooks";
import {CircularProgressWithLabel} from "../../mui/CircularProgressWithLabel";
import {ConfirmDialog} from "./ConfirmDialog";

export interface ITaskbarProgress {

    readonly value: Percentage | 'indeterminate';

    /**
     * Specify an optional message.  If no new message is given the existing
     * one is preserved.
     */
    readonly message?: string;

}

export type TaskbarProgressUpdate = ITaskbarProgress | 'terminate';

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
export const TaskbarDialog = deepMemo(function TaskbarDialog(props: TaskbarDialogPropsWithCallback) {

    const [progress, setProgress, progressRef] = useStateRef<ITaskbarProgress>({value: 0, message: props.message});
    const [open, setOpen] = React.useState(true);
    const [cancelRequested, setCancelRequested] = React.useState(false);

    const handleCancel = React.useCallback(() => {
        setCancelRequested(true);
    }, []);

    const doCancel = React.useCallback(() => {
        setCancelRequested(false);

        if (props.onCancel) {
            props.onCancel();
        }

    }, [props]);

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
            message: updateProgress.message ? updateProgress.message : progressRef.current.message
        }

        setProgress(newProgress);


    }

    useComponentDidMount(() => {
        props.onProgressCallback(setProgressCallback);
    });

    const Progress = () => {

        if (progress.value === 'indeterminate' || progress.value === 0) {
            // TODO: don't show indeterminate when we are zero in the future when we can show a circular progress
            // with a background color
            return <CircularProgress variant="indeterminate"/>;
        } else {
            return <CircularProgressWithLabel variant="static" value={progress.value}/>
        }

    };

    const Action = () => {
        return (
            <>
                <Progress/>

                {props.onCancel && (
                    <IconButton color="inherit"
                                onClick={handleCancel}>
                        <CloseIcon/>
                    </IconButton>
                )}

                {cancelRequested && (
                    <ConfirmDialog title="Are you sure you wish to cancel?"
                                   subtitle="This will cancel all pending tasks"
                                   type="danger"
                                   onAccept={doCancel}/>)}

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
            message={progress.message}
            action={<Action/>}/>
    );

});
