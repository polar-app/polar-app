import * as React from 'react';
import {Button} from "reactstrap";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Strings} from "polar-shared/src/util/Strings";

export class RatingButton<A> extends React.Component<IProps<A>, IState> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const {rating, taskRep} = this.props;

        const createColor = (): string => {
            switch (rating) {
                case "again":
                    return 'danger';
                case "hard":
                    return 'secondary';
                case "good":
                    return 'secondary';
                case "easy":
                    return 'success';
                default:
                    throw new Error("Unknown rating: " + rating);
            }
        };

        const color = createColor();

        const text = Strings.upperFirst(this.props.rating);

        return <Button color={color}
                       className="m-1"
                       style={{flexGrow: 1}}
                       onClick={() => this.props.onRating(taskRep, 'again')}>{text}</Button>;

    }

}

export interface IProps<A> {

    readonly taskRep: TaskRep<A>;
    readonly rating: Rating;
    readonly onRating: RatingCallback<A>;

}

export interface IState {

}
