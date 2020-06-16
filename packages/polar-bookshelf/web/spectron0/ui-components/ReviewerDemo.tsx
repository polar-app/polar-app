import * as React from 'react';
import {
    Task,
    TaskRep
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FlashcardTaskAction} from "../../../apps/repository/js/reviewer/cards/FlashcardTaskAction";
import {Refs} from "polar-shared/src/metadata/Refs";
import {Flashcards} from "../../js/metadata/Flashcards";
import {DocAnnotations} from "../../js/annotation_sidebar/DocAnnotations";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {FlashcardTaskActions} from "../../../apps/repository/js/reviewer/cards/FlashcardTaskActions";
import {Preconditions} from "polar-shared/src/Preconditions";
import {MockDocMetas} from "../../js/metadata/DocMetas";
import {
    FinishedCallback,
    RatingCallback,
    SuspendedCallback
} from "../../../apps/repository/js/reviewer/Reviewer2";
import {BrowserRouter, Switch} from "react-router-dom";
import {ReactRouters} from "../../js/react/router/ReactRouters";
import {Reviewer2} from "../../../apps/repository/js/reviewer/Reviewer2";
import {ReviewerDialog2} from "../../../apps/repository/js/reviewer/ReviewerDialog2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
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

export const ReviewerDemo = () => {

    const [open, setOpen] = React.useState(true);

    return (

        <BrowserRouter key="browser-router">
            <Switch location={ReactRouters.createLocationWithPathAndHash()}>
                <ReviewerDialog2 open={open}
                                 onClose={() => setOpen(false)}>

                    <Reviewer2 taskReps={taskReps}
                               doRating={doRating}
                               doSuspended={doSuspended}
                               doFinished={doFinished}/>

                </ReviewerDialog2>
            </Switch>
        </BrowserRouter>

    );
};
