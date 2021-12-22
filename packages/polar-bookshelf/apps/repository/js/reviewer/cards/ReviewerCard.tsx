import * as React from "react";
import {IReadingTaskAction} from "./ReadingTaskAction";
import {ReadingCard} from "./ReadingCard";
import {IFlashcardTaskAction} from "./FlashcardTaskAction";
import {FlashcardCard} from "./FlashcardCard";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";
import {TaskActionPredicates} from "../TaskActionPredicates";
import {ITaskAction} from "../ITaskAction";

interface IDoReadingCardProps {
    readonly taskRep: ITaskRep<IReadingTaskAction>;
}

const DoReadingCard = deepMemo(function DoReadingCard(props: IDoReadingCardProps) {
    const {taskRep: readingTaskRep} = props;

    return <ReadingCard taskRep={readingTaskRep}/>;

});

interface IDoFlashcardCardProps {
    readonly taskRep: ITaskRep<IFlashcardTaskAction>;
}

const DoFlashcardCard: React.FC<IDoFlashcardCardProps> = deepMemo(function DoFlashcardCard(props) {
    const {taskRep: flashcardTaskRep} = props;

    const flashcardTaskAction = flashcardTaskRep.action;
    const front = flashcardTaskAction.front;
    const back = flashcardTaskAction.back;

    return <FlashcardCard taskRep={flashcardTaskRep}
                          front={front}
                          back={back}/>;
});


interface IReviewerCardProps {
    readonly taskRep: ITaskRep<ITaskAction>;
}

export const ReviewerCard: React.FC<IReviewerCardProps> = (props) => {
    const { taskRep } = props;

    if (TaskActionPredicates.isReadingTaskRep(taskRep)) {
        return <DoReadingCard taskRep={taskRep} />;
    } else if (TaskActionPredicates.isFlashcardTaskRep(taskRep)) {
        return <DoFlashcardCard taskRep={taskRep} />;
    }

    return null;
};
