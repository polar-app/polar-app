import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {IRatingOption, RatingButtonSet} from "./RatingButtonSet";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {ReviewRatingGlobalHotKeys} from "./ReviewRatingGlobalHotKeys";
import {DocAnnotationTaskAction} from '../DocAnnotationReviewerTasks';

const BUTTONS: ReadonlyArray<IRatingOption> = [
    {
        rating: 'again',
        color: red[500]
    },
    {
        rating: 'hard',
        color: red[200]
    },
    {
        rating: 'good',
        color: green[200]
    },
    {
        rating: 'easy',
        color: green[500]
    },
]


export interface IProps {

    readonly taskRep: TaskRep<DocAnnotationTaskAction>;
    readonly stage: Stage;

}

export const ReviewRatingButtons = deepMemo(function ReviewRatingButtons(props: IProps) {

    return (
        <>
            <ReviewRatingGlobalHotKeys/>
            <RatingButtonSet taskRep={props.taskRep} options={BUTTONS} />
        </>
    );

});
