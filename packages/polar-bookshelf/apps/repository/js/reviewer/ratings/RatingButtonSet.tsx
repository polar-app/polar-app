import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {RatingButton} from './RatingButton';
import {useReviewerCallbacks} from "../ReviewerStore";

export interface IProps<A> {
    readonly taskRep: TaskRep<A>;
    readonly options: ReadonlyArray<IRatingOption>;
}

export interface IRatingOption {
    readonly rating: Rating;
    readonly color: string;
}

export const RatingButtonSet = function<A>(props: IProps<A>) {

    const {options, taskRep} = props;

    const {onRating} = useReviewerCallbacks();

    const handleRating = React.useCallback((taskRep: TaskRep<any>, rating: Rating) => {
        onRating(taskRep, rating);

    }, [onRating]);

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
