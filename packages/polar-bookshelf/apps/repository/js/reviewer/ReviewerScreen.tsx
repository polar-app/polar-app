import * as React from 'react';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useDocAnnotationReviewerStoreProvider} from './ReviewerStore';
import {ReviewerRunner} from './ReviewerRunner';
import {useHistory} from 'react-router-dom';
import {ReviewerDialog} from './ReviewerDialog';
import {CalculatedTaskReps} from 'polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator';
import {DocAnnotationReviewerTasks, DocAnnotationTaskAction} from './DocAnnotationReviewerTasks';


export interface IProps {
    readonly annotations: ReadonlyArray<IDocAnnotation>;
    readonly mode: RepetitionMode;
    readonly onClose?: () => void;
    readonly limit?: number;
}

export const ReviewerScreen = deepMemo(function ReviewerScreen(props: IProps) {
    const { annotations, mode, onClose, limit } = props;

    const dataProvider = React.useCallback(async (): Promise<CalculatedTaskReps<DocAnnotationTaskAction>> => {
        return DocAnnotationReviewerTasks.createTasks(annotations, mode, limit);
    }, [annotations, mode, limit]);

    const store = useDocAnnotationReviewerStoreProvider({
        mode,
        dataProvider,
        onClose,
    });

    const history = useHistory();

    const handleClose = React.useCallback(() => {
        if (store) {
            store.onSuspended();
        }

        if (onClose) {
            onClose();
        }

        history.replace({ pathname: "/annotations", hash: "" });
    }, [history, store, onClose]);


    return (
        <ReviewerDialog onClose={handleClose}>
            <ReviewerRunner store={store} />
        </ReviewerDialog>
    );
});
