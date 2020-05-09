import * as React from 'react';
import {useState} from 'react';
import {TaskBody} from "./TaskBody";
import {RatingButtons} from "../RatingButtons";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RatingCallback} from "../Reviewer";
import {Preconditions} from "polar-shared/src/Preconditions";
import {FadeIn} from "../../../../../web/js/ui/motion/FadeIn";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {createStyles} from "@material-ui/core";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            fontSize: '2.0rem',
        },
    }),
);

namespace card {

    export const Body = (props: any) => {

        const classes = useStyles();

        return (
            <FadeIn>
                <Paper variant="outlined"
                       className={"mb-auto ml-auto mr-auto shadow-narrow p-3 " + classes.card}
                       style={{
                           minWidth: '300px',
                           maxWidth: '700px',
                           width: '85%'
                       }}>
                    {props.children}
                </Paper>
            </FadeIn>
        );
    };

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
        <card.Body>

            <div className="mb-4">
                {props.front}
            </div>

            <Divider/>

            <div className="mt-4">
                {props.back}
            </div>

        </card.Body>
    </card.Parent>
);

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

/**
 * Basic flashcard component which allows us to display any type of card as long as it has a front/back design.
 */
export const FlashcardCard = (props: IProps) => {

    const [state, setState] = useState<IState>({side: 'front'});

    function onShowAnswer() {
        setState({side: 'back'});
    }

    function onRating(taskRep: TaskRep<any>, rating: Rating) {
        props.onRating(taskRep, rating);
        setState({side: 'front'});
    }

    Preconditions.assertPresent(props.front, 'front');
    Preconditions.assertPresent(props.back, 'back');


    const {taskRep} = props;

    const Main = () => {

        switch (state.side) {

            case 'front':
                return (
                    <FrontCard>
                        {props.front}
                    </FrontCard>
                );

            case 'back':
                return (
                    <FrontAndBackCard front={props.front}
                                      back={props.back}/>
                );

            default:
                throw new Error("Invalid side: " + state.side);

        }

    };

    const Buttons = () => {
        switch (state.side) {

            case 'front':
                return (
                    <Button color="primary"
                            variant="contained"
                            size="large"
                            onClick={() => onShowAnswer()}>
                        Show Answer
                    </Button>
                );

            case 'back':
                return <RatingButtons taskRep={taskRep}
                                      stage={taskRep.stage}
                                      onRating={onRating}/>;
            default:
                throw new Error("Invalid side: " + state.side);

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

};
