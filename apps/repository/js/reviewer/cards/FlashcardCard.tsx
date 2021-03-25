import * as React from 'react';
import {TaskBody} from "./TaskBody";
import {RatingButtons} from "../ratings/RatingButtons";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Preconditions} from "polar-shared/src/Preconditions";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {CardPaper} from "./CardPaper";
import { useFlashcardStore, useFlashcardCallbacks, FlashcardStoreProvider } from './FlashcardStore';
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import { FlashcardGlobalHotKeys } from './FlashcardGlobalHotKeys';

namespace card {

    export const Body = (props: any) => {

        return (
            <CardPaper>
                {props.children}
            </CardPaper>
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

    readonly front: React.ReactElement<any>;

    readonly back: React.ReactElement<any>;

}

/**
 * Basic flashcard component which allows us to display any type of card as long as it has a front/back design.
 */
export const FlashcardCardInner = deepMemo(function FlashcardCardInner(props: IProps) {

    const {side} = useFlashcardStore(['side']);
    const {setSide} = useFlashcardCallbacks();
    React.useMemo(() => setSide('front'), [setSide]);

    const handleShowAnswer = React.useCallback(() => {
        setSide('back');
    }, [setSide]);

    Preconditions.assertPresent(props.front, 'front');
    Preconditions.assertPresent(props.back, 'back');

    const {taskRep} = props;

    const Main = () => {

        switch (side) {

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
                throw new Error("Invalid side: " + side);

        }

    };

    const Buttons = () => {
        switch (side) {

            case 'front':
                return (
                    <Button color="primary"
                            variant="contained"
                            size="large"
                            onClick={handleShowAnswer}>
                        Show Answer
                    </Button>
                );

            case 'back':
                return (
                    <RatingButtons taskRep={taskRep}
                                      stage={taskRep.stage}/>
                );
            default:
                throw new Error("Invalid side: " + side);

        }
    };

    return (
        <TaskBody taskRep={taskRep}>

            <TaskBody.Main taskRep={taskRep}>
                <Main/>
            </TaskBody.Main>

            <TaskBody.Footer taskRep={taskRep}>

                <div className="mt-2 mb-2">
                    <Buttons/>
                </div>

            </TaskBody.Footer>

        </TaskBody>
    );

});

export const FlashcardCard = (props: IProps) => {

    return (
        <FlashcardStoreProvider>
            <>
                <FlashcardGlobalHotKeys/>
                <FlashcardCardInner {...props}/>
            </>
        </FlashcardStoreProvider>
    );
}
