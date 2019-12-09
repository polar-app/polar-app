import * as React from 'react';
import {Button} from "reactstrap";
import {CardBody} from "./CardBody";
import {RatingButtons} from "../RatingButtons";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "../Reviewer";
import {Preconditions} from "polar-shared/src/Preconditions";

/**
 * Basic flashcard component which allows us to display any type of card as long as it has a front/back design.
 */
export class FlashcardCard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onShowAnswer = this.onShowAnswer.bind(this);

        Preconditions.assertPresent(this.props.front, 'front');
        Preconditions.assertPresent(this.props.back, 'back');

        this.state = {
            side: 'front'
        };

    }

    public render() {

        const {taskRep} = this.props;

        const Main = () => {

            switch (this.state.side) {

                case 'front':
                    return this.props.front;

                case 'back':
                    return <div>
                        {this.props.front}

                        <div className="m-2">
                            <hr/>
                        </div>
                        {this.props.back}
                    </div>;

                default:
                    throw new Error("Invalid side: " + this.state.side);

            }

        };

        const Buttons = () => {
            switch (this.state.side) {

                case 'front':
                    return <Button color="primary"
                                   size="md"
                                   onClick={() => this.onShowAnswer()}>
                        Show Answer
                    </Button>;

                case 'back':
                    return <RatingButtons taskRep={taskRep}
                                          stage={taskRep.stage}
                                          onRating={this.props.onRating}/>;
                default:
                    throw new Error("Invalid side: " + this.state.side);

            }
        };

        return <CardBody taskRep={taskRep}>

            <CardBody.Main taskRep={taskRep}>
                <Main/>
            </CardBody.Main>

            <CardBody.Footer taskRep={taskRep}>
                <Buttons/>
            </CardBody.Footer>

        </CardBody>;

    }

    private onShowAnswer() {
        this.setState({side: 'back'});
    }

}


export type FlashcardSide = 'front' | 'back';

export interface IProps {

    readonly taskRep: TaskRep<FlashcardTaskAction>;

    readonly onRating: RatingCallback<FlashcardTaskAction>;

    readonly front: React.ReactElement<any>;

    readonly back: React.ReactElement<any>;

}

export interface IState {
    readonly side: FlashcardSide;
}
