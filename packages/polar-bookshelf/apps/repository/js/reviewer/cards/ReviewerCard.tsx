import {ReadingTaskAction} from "./ReadingTaskAction";
import {ReadingCard} from "./ReadingCard";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {FlashcardCard} from "./FlashcardCard";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import * as React from "react";

const DoReadingCard = (props: ReviewerCardProps) => {
    const {taskRep} = props;
    const readingTaskRep = taskRep as any as TaskRep<ReadingTaskAction>;

    return <ReadingCard taskRep={readingTaskRep}
                        onRating={props.onRating}/>;

};

const DoFlashcardCard = (props: ReviewerCardProps) => {
    const {taskRep} = props;

    const flashcardTaskRep = taskRep as any as TaskRep<FlashcardTaskAction>;

    const flashcardTaskAction = flashcardTaskRep.action;
    const front = flashcardTaskAction.front;
    const back = flashcardTaskAction.back;

    return <FlashcardCard taskRep={flashcardTaskRep}
                          front={front}
                          back={back}
                          onRating={props.onRating}/>;
};

interface ReviewerCardProps {
    readonly taskRep: TaskRep<any>;
    readonly onRating: (taskRep: TaskRep<any>, rating: Rating) => void;
}

export const ReviewerCard = (props: ReviewerCardProps) => {

    if (props.taskRep!.mode === 'reading') {
        return <DoReadingCard {...props}/>;
    } else {
        return <DoFlashcardCard {...props}/>;
    }

};
