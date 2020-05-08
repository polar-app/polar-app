import * as React from 'react';
import {TaskBody} from "./TaskBody";
import {RatingButtons} from "../RatingButtons";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "../Reviewer";
import {Preconditions} from "polar-shared/src/Preconditions";
import {FadeIn} from "../../../../../web/js/ui/motion/FadeIn";
import Button from "@material-ui/core/Button";

namespace card {

    export const Body = (props: any) => (
        <FadeIn>
            <div className="mb-auto ml-auto mr-auto shadow-narrow p-3 border rounded flashcard"
                 style={{
                     minWidth: '300px',
                     maxWidth: '700px',
                     width: '85%'
                 }}>
                {props.children}
            </div>
        </FadeIn>
    );

    export const Parent = (props: any) => (
        <div className="mt-3 pl-3 pr-3 flashcard-parent"
             style={{
                 width: '100%',
             }}>
            {props.children}
        </div>
    );

}

interface FrontCardProps {
    readonly children: JSX.Element;
}

const FrontCard = (props: FrontCardProps) => (
    <card.Parent>
        <card.Body>
            {props.children}
        </card.Body>
    </card.Parent>
);

interface FrontAndBackCardProps {
    readonly front: JSX.Element;
    readonly back: JSX.Element;
}
const FrontAndBackCard = (props: FrontAndBackCardProps) => (
    <card.Parent>
        <div className="mb-4">
            <card.Body>
                {props.front}
            </card.Body>
        </div>
        <div className="mt-4">
            <card.Body>
                {props.back}
            </card.Body>
        </div>
    </card.Parent>
);

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
                    return (
                        <FrontCard>
                            {this.props.front}
                        </FrontCard>
                    );

                case 'back':
                    return (
                        <FrontAndBackCard front={this.props.front}
                                          back={this.props.back}/>
                    );

                default:
                    throw new Error("Invalid side: " + this.state.side);

            }

        };

        const Buttons = () => {
            switch (this.state.side) {

                case 'front':
                    return (
                        <Button color="primary"
                                variant="contained"
                                size="large"
                                onClick={() => this.onShowAnswer()}>
                            Show Answer
                        </Button>
                    );

                case 'back':
                    return <RatingButtons taskRep={taskRep}
                                          stage={taskRep.stage}
                                          onRating={this.props.onRating}/>;
                default:
                    throw new Error("Invalid side: " + this.state.side);

            }
        };

        return <TaskBody taskRep={taskRep}>

            <TaskBody.Main taskRep={taskRep}>
                <Main/>
            </TaskBody.Main>

            <TaskBody.Footer taskRep={taskRep}>

                <div className="mt-2 mb-2">
                    <Buttons/>
                </div>

            </TaskBody.Footer>

        </TaskBody>;

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
