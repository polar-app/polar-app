import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {RatingButton2} from './RatingButton2';

export interface IProps<A> {
    readonly taskRep: TaskRep<A>;
    readonly options: ReadonlyArray<IRatingOption>;
    readonly onRating: RatingCallback<A>;
}

export interface IRatingOption {
    readonly rating: Rating;
    readonly color: string;
}

export class RatingButtonSet<A> extends React.Component<IProps<A>> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const {options, taskRep} = this.props;

        return (
            <MUIButtonBar>

                {options.map(option => (
                    <RatingButton2 key={option.rating}
                                   taskRep={taskRep}
                                   rating={option.rating}
                                   color={option.color}
                                   onRating={() => this.props.onRating(taskRep, option.rating)}/>
                    ))}

            </MUIButtonBar>
        );

    }

}
