import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {LearningRatingButtons} from "./LearningRatingButtons";
import {ReviewRatingButtons} from "./ReviewRatingButtons";
import {DocAnnotationTaskAction} from '../DocAnnotationReviewerTasks';

export interface IProps {

    readonly taskRep: TaskRep<DocAnnotationTaskAction>;
    readonly stage: Stage;

}

export const RatingButtons = deepMemo(function RatingButtons(props: IProps) {

    if (['new', 'learning'].includes(props.stage)) {
        return <LearningRatingButtons {...props}/>;
    } else {
        return <ReviewRatingButtons {...props}/>;
    }

});
