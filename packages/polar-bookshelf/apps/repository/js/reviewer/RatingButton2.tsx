import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Strings} from "polar-shared/src/util/Strings";
import {ColorButton} from './ColorButton';


export interface IProps<A> {

    readonly taskRep: TaskRep<A>;
    readonly rating: Rating;
    readonly color: string;
    readonly onRating: RatingCallback<A>;

}

export interface IState {

}

export class RatingButton2<A> extends React.Component<IProps<A>, IState> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const {rating, taskRep, color} = this.props;

        const text = Strings.upperFirst(this.props.rating);

        return (
            <ColorButton variant="contained"
                         color={color}
                         size="large"
                         style={{flexGrow: 1}}
                         onClick={() => this.props.onRating(taskRep, rating)}>
                {text}
            </ColorButton>
        );

    }

}
