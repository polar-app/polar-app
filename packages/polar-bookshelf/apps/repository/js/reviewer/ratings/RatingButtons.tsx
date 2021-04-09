import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {LearningRatingButtons} from "./LearningRatingButtons";
import {ReviewRatingButtons} from "./ReviewRatingButtons";

export interface IProps<A> {

    readonly taskRep: TaskRep<A>;
    readonly stage: Stage;

}

export const RatingButtons = deepMemo(function<A>(props: IProps<A>) {

    if (['new', 'learning'].includes(props.stage)) {
        return <LearningRatingButtons {...props}/>;
    } else {
        return <ReviewRatingButtons {...props}/>;
    }

});
