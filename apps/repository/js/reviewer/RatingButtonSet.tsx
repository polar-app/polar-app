import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RatingButton} from "./RatingButton";

export class RatingButtonSet extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {ratings, taskRep} = this.props;

        return ratings.map(rating => <RatingButton key={rating}
                                                   taskRep={taskRep}
                                                   rating={rating}
                                                   onRating={() => this.props.onRating(taskRep, rating)}/>);

    }

}

export interface IProps {

    readonly taskRep: TaskRep;
    readonly ratings: ReadonlyArray<Rating>;
    readonly onRating: RatingCallback;

}

export interface IState {

}
