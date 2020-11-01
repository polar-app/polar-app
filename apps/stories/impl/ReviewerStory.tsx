import * as React from 'react';
import {
    Task,
    TaskRep
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Refs} from "polar-shared/src/metadata/Refs";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Preconditions} from "polar-shared/src/Preconditions";
import {BrowserRouter, Switch} from "react-router-dom";
import {FlashcardTaskAction} from "../../repository/js/reviewer/cards/FlashcardTaskAction";
import {MockDocMetas} from "../../../web/js/metadata/DocMetas";
import {Flashcards} from "../../../web/js/metadata/Flashcards";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {FlashcardTaskActions} from "../../repository/js/reviewer/cards/FlashcardTaskActions";
import {RatingCallback} from "../../repository/js/reviewer/ReviewerStore";
import {FinishedCallback, Reviewer3, SuspendedCallback} from "../../repository/js/reviewer/Reviewer3";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import {ReviewerDialog2} from "../../repository/js/reviewer/ReviewerDialog2";
//
// const createFlashcardTaskReps = async () => {
//
//     const ref = Refs.create('1234', 'text-highlight');
//
//     const flashcard = Flashcards.createFrontBack('What is the capital of California? ', 'Sacramento', ref);
//
//     const docInfo = DocInfos.create('0x0001', 1);
//     const repoAnnotation = DocAnnotations.createFromFlashcard(null!, flashcard, AnnotationType.FLASHCARD);
//     const repoDocAnnotations = [repoAnnotation];
//
//     return await ReviewerTasks.createFlashcardTasks(repoDocAnnotations, 10);
//
// };


const createFlashcardTaskReps = (): ReadonlyArray<TaskRep<FlashcardTaskAction>> => {

    const docMeta = MockDocMetas.createMockDocMeta();
    const pageMeta = Object.values(docMeta.pageMetas)[0];
    const ref = Refs.create('1234', 'text-highlight');

    const createFrontAndBackAction = () => {

        const flashcard = Flashcards.createFrontBack('What is the capital of California? ', 'Sacramento', ref);
        const docAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions.create(flashcard, docAnnotation);
        return flashcardTaskActions[0];
    };

    const createClozeAction = () => {
        const flashcard = Flashcards.createCloze('The capital of california is {{c1::Sacramento}}.', ref);
        const docAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions.create(flashcard, docAnnotation);
        return flashcardTaskActions[0];
    };

    const clozeAction = createClozeAction();

    Preconditions.assertPresent(clozeAction, 'clozeAction');

    const tasks: ReadonlyArray<Task<FlashcardTaskAction>> = [
        {
            id: "10102",
            action: clozeAction,
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10102",
            action: createFrontAndBackAction(),
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        // {
        //     id: "10103",
        //     action: createFrontAndBackAction(),
        //     created: ISODateTimeStrings.create(),
        //     color: 'red',
        //     mode: 'flashcard'
        // }
    ];

    return tasks.map(task => TasksCalculator.createInitialLearningState(task));

};

const taskReps = createFlashcardTaskReps();

const doRating: RatingCallback<FlashcardTaskAction> = async (taskRep, rating) => {
    console.log("onRating: ", {taskRep, rating});
};

const doSuspended: SuspendedCallback<FlashcardTaskAction> = async (taskRep) => {
    console.log("onSuspended: ", {taskRep});
};

const doFinished: FinishedCallback = async (cancelled) => {
    console.log("onFinished: ", {cancelled});
};

export const ReviewerStory = () => {

    const [open, setOpen] = React.useState(true);

    return (

        <BrowserRouter key="browser-router">
            <Switch location={ReactRouters.createLocationWithPathAndHash()}>
                <ReviewerDialog2 open={open}
                                 onClose={() => setOpen(false)}>

                    <Reviewer3 taskReps={taskReps}
                               doRating={doRating}
                               doSuspended={doSuspended}
                               doFinished={doFinished}/>

                </ReviewerDialog2>
            </Switch>
        </BrowserRouter>

    );
};
