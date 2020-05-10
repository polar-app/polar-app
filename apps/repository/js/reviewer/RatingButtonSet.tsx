import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {MUIButtonBar} from "../../../../web/spectron0/material-ui/MUIButtonBar";
import {RatingButton2} from './RatingButton2';

export interface IProps<A> {
    readonly taskRep: TaskRep<A>;
    readonly ratings: ReadonlyArray<IRatingButton>;
    readonly onRating: RatingCallback<A>;
}

export interface IRatingButton {
    readonly rating: Rating;
    readonly color: string;
}

export class RatingButtonSet<A> extends React.Component<IProps<A>> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const {ratings, taskRep} = this.props;

        return (
            <MUIButtonBar>

                {ratings.map(rating => (
                    <RatingButton2 key={rating.rating}
                                   taskRep={taskRep}
                                   rating={rating.rating}
                                   color={rating.color}
                                   onRating={() => this.props.onRating(taskRep, rating.rating)}/>
                    ))}

            </MUIButtonBar>
        );

    }

}
