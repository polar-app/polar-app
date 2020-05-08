import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "./Reviewer";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Strings} from "polar-shared/src/util/Strings";
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import {ColorButton} from './ColorButton';


export class RatingButton<A> extends React.Component<IProps<A>, IState> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);
    }

    public render() {

        const {rating, taskRep} = this.props;

        const createColor = (): string => {
            switch (rating) {
                case "again":
                    return red[500];
                case "hard":
                    return grey[500];
                case "good":
                    return grey[500];
                case "easy":
                    return green[500];
                default:
                    throw new Error("Unknown rating: " + rating);
            }
        };

        const color = createColor();

        const text = Strings.upperFirst(this.props.rating);

        return (
            <ColorButton variant="contained"
                         color={color}
                         size="large"
                         style={{flexGrow: 1}}
                         onClick={() => this.props.onRating(taskRep, 'again')}>
                {text}
            </ColorButton>
        );

    }

}

export interface IProps<A> {

    readonly taskRep: TaskRep<A>;
    readonly rating: Rating;
    readonly onRating: RatingCallback<A>;

}

export interface IState {

}
