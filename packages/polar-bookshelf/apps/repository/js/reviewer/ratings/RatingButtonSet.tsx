import * as React from 'react';
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {RatingButton} from './RatingButton';
import {useReviewerStore} from "../ReviewerStore";
import {ITaskAction} from '../ReviewerTasks';
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";

export interface IProps {
    readonly taskRep: ITaskRep<ITaskAction>;
    readonly options: ReadonlyArray<IRatingOption>;
}

export interface IRatingOption {
    readonly rating: Rating;
    readonly color: string;
}

export const RatingButtonSet = function(props: IProps) {

    const {options, taskRep} = props;
    const store = useReviewerStore();

    const handleRating = React.useCallback((taskRep: ITaskRep<ITaskAction>, rating: Rating) => {
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
