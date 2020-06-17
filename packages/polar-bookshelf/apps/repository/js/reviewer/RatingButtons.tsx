import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {IRatingOption, RatingButtonSet} from "./RatingButtonSet";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import grey from '@material-ui/core/colors/grey';

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
    readonly onRating: RatingCallback<A>;

}

export class RatingButtons<A> extends React.Component<IProps<A>> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const Learning = () => {
            return <RatingButtonSet taskRep={this.props.taskRep}
                                    options={LEARNING_BUTTONS}
                                    onRating={this.props.onRating}/>;
        };

        const Review = () => {
            return <RatingButtonSet taskRep={this.props.taskRep}
                                    options={REVIEW_BUTTONS}
                                    onRating={this.props.onRating}/>;
        };

        if (['new', 'learning'].includes(this.props.stage)) {
            return <Learning/>;
        } else {
            return <Review/>;
        }

    }

}
