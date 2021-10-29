import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {RatingButton} from './RatingButton';
import {useDocAnnotationReviewerStore} from "../ReviewerStore";
import {DocAnnotationTaskAction} from '../DocAnnotationReviewerTasks';

export interface IProps {
    readonly taskRep: TaskRep<DocAnnotationTaskAction>;
    readonly options: ReadonlyArray<IRatingOption>;
}

export interface IRatingOption {
    readonly rating: Rating;
    readonly color: string;
}

export const RatingButtonSet = function(props: IProps) {

    const {options, taskRep} = props;
    const store = useDocAnnotationReviewerStore();

    const handleRating = React.useCallback((taskRep: TaskRep<DocAnnotationTaskAction>, rating: Rating) => {
        store.onRating(taskRep, rating);
    }, [store]);

    return (
        <MUIButtonBar>

            {options.map(option => (
                <RatingButton key={option.rating}
                              taskRep={taskRep}
                              rating={option.rating}
                              color={option.color}
                              onRating={() => handleRating(taskRep, option.rating)}/>
                ))}

        </MUIButtonBar>
    );

}
