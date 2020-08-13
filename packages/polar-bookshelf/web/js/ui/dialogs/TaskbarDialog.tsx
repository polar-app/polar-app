import React from 'react';
import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import {useComponentDidMount} from "../../hooks/ReactLifecycleHooks";
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

export interface IProgress {

    readonly value: Percentage | 'indeterminate';

    /**
     * Specify an optional message.  If no new message is given the existing
     * one is preserved.
     */
    readonly message?: string;

}

export type TaskbarProgressCallback = (progress: IProgress) => void;

export interface TaskbarDialogProps {

    /**
     * Initial message for the TaskBar.
     */
    readonly message: string;

    readonly autoHideDuration?: number;

}

export interface TaskbarDialogPropsWithCallback extends TaskbarDialogProps {

    // called once after init so that we can tell the caller about the progress
    // callback we created
    readonly onProgressCallback: Callback1<TaskbarProgressCallback>;
}

/**
 * Like a Snackbar but it includes progress...
 */
export const TaskbarDialog = React.memo((props: TaskbarDialogPropsWithCallback) => {

    const [progress, setProgress] = React.useState<IProgress>({value: 0, message: props.message});
    const [open, setOpen] = React.useState(true);

    function setProgressCallback(updateProgress: IProgress) {

        const newProgress = {
            ...updateProgress,
            message: updateProgress.message ? updateProgress.message : progress.message
        }

        setProgress(newProgress);

        if (newProgress.value === 100) {
            // close the task but only after a delay so that the user sees that
            // it finished.
            setTimeout(() => setOpen(false), 1000);
        }

    }

    useComponentDidMount(() => {
        props.onProgressCallback(setProgressCallback);
    });

    const Action = () => {

        if (progress.value === 'indeterminate') {
            return <CircularProgress />;
        } else {
            return <CircularProgress variant="static" value={progress.value}/>
        }

    };

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
    )

});
