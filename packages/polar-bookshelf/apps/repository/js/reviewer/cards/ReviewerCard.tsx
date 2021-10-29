import * as React from "react";
import {ReadingTaskAction} from "./ReadingTaskAction";
import {ReadingCard} from "./ReadingCard";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {FlashcardCard} from "./FlashcardCard";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocAnnotationTaskAction, DocAnnotationTaskActionPredicates} from "../DocAnnotationReviewerTasks";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

interface IDoReadingCardProps {
    readonly taskRep: TaskRep<ReadingTaskAction<IDocAnnotation>>;
}

const DoReadingCard = deepMemo(function DoReadingCard(props: IDoReadingCardProps) {
    const {taskRep: readingTaskRep} = props;

    return <ReadingCard taskRep={readingTaskRep}/>;

});

interface IDoFlashcardCardProps {
    readonly taskRep: TaskRep<FlashcardTaskAction<IDocAnnotation>>;
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
    readonly taskRep: TaskRep<DocAnnotationTaskAction>;
}

export const ReviewerCard: React.FC<IReviewerCardProps> = (props) => {
    const { taskRep } = props;

    if (DocAnnotationTaskActionPredicates.isReadingTaskRep(taskRep)) {
        return <DoReadingCard taskRep={taskRep} />;
    } else if (DocAnnotationTaskActionPredicates.isFlashcardTaskRep(taskRep)) {
        return <DoFlashcardCard taskRep={taskRep} />;
    }

    return null;
};
