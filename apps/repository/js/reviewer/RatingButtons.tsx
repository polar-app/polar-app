import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Stage} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RatingButtonSet} from "./RatingButtonSet";

export class RatingButtons<A> extends React.Component<IProps<A>, IState> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const Learning = () => {
            return <RatingButtonSet taskRep={this.props.taskRep}
                                    ratings={['again', 'good', 'easy']}
                                    onRating={this.props.onRating}/>;
        };

        const Review = () => {
            return <RatingButtonSet taskRep={this.props.taskRep}
                                    ratings={['again', 'hard', 'good', 'easy']}
                                    onRating={this.props.onRating}/>;
        };

        if (['new', 'learning'].includes(this.props.stage)) {
            return <Learning/>;
        } else {
            return <Review/>;
        }

    }

}

export interface IProps<A> {

    readonly taskRep: TaskRep<A>;
    readonly stage: Stage;
    readonly onRating: RatingCallback<A>;

}

export interface IState {

}
