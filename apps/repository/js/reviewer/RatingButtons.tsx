import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {IRatingOption, RatingButtonSet} from "./RatingButtonSet";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import grey from '@material-ui/core/colors/grey';
import {deepMemo} from "../../../../web/js/react/ReactUtils";

const LEARNING_BUTTONS: ReadonlyArray<IRatingOption> = [
    {
        rating: 'again',
        color: red[500]
    },
    {
        rating: 'good',
        color: grey[500]
    },
    {
        rating: 'easy',
        color: green[500]
    },
];

const REVIEW_BUTTONS: ReadonlyArray<IRatingOption> = [
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

export interface IProps<A> {

    readonly taskRep: TaskRep<A>;
    readonly stage: Stage;

}

export const RatingButtons = deepMemo(function<A>(props: IProps<A>) {

    const Learning = () => {
        return <RatingButtonSet taskRep={props.taskRep}
                                options={LEARNING_BUTTONS}/>;
    };

    const Review = () => {
        return <RatingButtonSet taskRep={props.taskRep}
                                options={REVIEW_BUTTONS}/>;
    };

    if (['new', 'learning'].includes(props.stage)) {
        return <Learning/>;
    } else {
        return <Review/>;
    }

});
