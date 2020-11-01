import * as React from 'react';
import {
    Task,
    TaskRep
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Refs} from "polar-shared/src/metadata/Refs";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {BrowserRouter, Switch} from "react-router-dom";
import {FlashcardTaskAction} from "../../repository/js/reviewer/cards/FlashcardTaskAction";
import {MockDocMetas} from "../../../web/js/metadata/DocMetas";
import {Flashcards} from "../../../web/js/metadata/Flashcards";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {FlashcardTaskActions} from "../../repository/js/reviewer/cards/FlashcardTaskActions";
import {Reviewer3} from "../../repository/js/reviewer/Reviewer3";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import {ReviewerDialog2} from "../../repository/js/reviewer/ReviewerDialog2";
import Button from '@material-ui/core/Button';
import {HTMLStr} from "polar-shared/src/util/Strings";
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

    const createFrontAndBackAction = (front: string, back: string) => {

        const flashcard = Flashcards.createFrontBack(front, back, ref);
        const docAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions.create(flashcard, docAnnotation);
        return flashcardTaskActions[0];
    };

    const createClozeAction = (text: HTMLStr) => {
        const flashcard = Flashcards.createCloze(text, ref);
        const docAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions.create(flashcard, docAnnotation);
        return flashcardTaskActions[0];
    };

    const tasks: ReadonlyArray<Task<FlashcardTaskAction>> = [
        {
            id: "10102",
            action: createClozeAction('The capital of california is {{c1::Sacramento}}.'),
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10103",
            action: createFrontAndBackAction('What is the capital of California? ', 'Sacramento'),
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10104",
            action: createFrontAndBackAction('Who let the dogs out?', 'woof, woof, woof, woof.'),
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10105",
            action: createFrontAndBackAction('Who is your daddy and what does he do?', "It's not a tumor!"),
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        }

    ];

    return tasks.map(task => TasksCalculator.createInitialLearningState(task));

};

const taskReps = createFlashcardTaskReps();

export const ReviewerStory = () => {

    const [open, setOpen] = React.useState(false);

    const doRating = React.useCallback(async (taskRep, rating) => {
        console.log("onRating: ", {taskRep, rating});
    }, []);

    const doSuspended = React.useCallback(async (taskRep) => {
        console.log("onSuspended: ", {taskRep});
    }, []);

    const doFinished = React.useCallback(async (cancelled) => {
        console.log("onFinished: ", {cancelled});
        setOpen(false);
    }, []);

    console.log("Working with N tasks: ", taskReps.length);

    return (

        <BrowserRouter key="browser-router">
            <Switch location={ReactRouters.createLocationWithPathAndHash()}>

                <>
                    {open && (
                        <ReviewerDialog2 open={open}
                                     onClose={() => setOpen(false)}>

                            <Reviewer3 taskReps={taskReps}
                                       doRating={doRating}
                                       doSuspended={doSuspended}
                                       doFinished={doFinished}/>

                        </ReviewerDialog2>)}

                    <Button variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => setOpen(true)}>
                        Start Review
                    </Button>
                </>

            </Switch>
        </BrowserRouter>

    );
};
