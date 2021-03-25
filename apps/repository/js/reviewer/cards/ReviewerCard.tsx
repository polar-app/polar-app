import * as React from "react";
import {ReadingTaskAction} from "./ReadingTaskAction";
import {ReadingCard} from "./ReadingCard";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {FlashcardCard} from "./FlashcardCard";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";

interface ReviewerCardProps {
    readonly taskRep: TaskRep<any>;
}

const DoReadingCard = deepMemo(function DoReadingCard(props: ReviewerCardProps) {
    const {taskRep} = props;
    const readingTaskRep = taskRep as any as TaskRep<ReadingTaskAction>;

    return <ReadingCard taskRep={readingTaskRep}/>;

});

const DoFlashcardCard = deepMemo(function DoFlashcardCard(props: ReviewerCardProps) {
    const {taskRep} = props;

    const flashcardTaskRep = taskRep as any as TaskRep<FlashcardTaskAction>;

    const flashcardTaskAction = flashcardTaskRep.action;
    const front = flashcardTaskAction.front;
    const back = flashcardTaskAction.back;

    return <FlashcardCard taskRep={flashcardTaskRep}
                          front={front}
                          back={back}/>;
});

export const ReviewerCard = (props: ReviewerCardProps) => {

    if (props.taskRep!.mode === 'reading') {
        return <DoReadingCard {...props}/>;
    } else {
        return <DoFlashcardCard {...props}/>;
    }

};
