import * as React from 'react';
import {Task, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Refs} from "polar-shared/src/metadata/Refs";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {BrowserRouter, Switch} from "react-router-dom";
import {Flashcards} from "../../../web/js/metadata/Flashcards";
import {DocAnnotations} from "../../../web/js/annotation_sidebar/DocAnnotations";
import {FlashcardTaskActions} from "../../repository/js/reviewer/cards/FlashcardTaskActions";
import {ReactRouters} from "../../../web/js/react/router/ReactRouters";
import Button from '@material-ui/core/Button';
import {HTMLStr} from "polar-shared/src/util/Strings";
import {MockDocMetas} from "polar-shared/src/metadata/MockDocMetas";
import {StoryHolder} from "../StoryHolder";
import {DocAnnotationFlashcardTaskAction, DocAnnotationTaskAction} from '../../repository/js/reviewer/DocAnnotationReviewerTasks';
import {ReviewerRunner} from "../../repository/js/reviewer/ReviewerRunner";
import {Reviewers} from "../../repository/js/reviewer/Reviewers";
import {DocAnnotationReviewerStoreContext, ReviewerStore, useDocAnnotationReviewerStore} from "../../repository/js/reviewer/ReviewerStore";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {observer} from 'mobx-react-lite';

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


const createFlashcardTaskReps = (): ReadonlyArray<TaskRep<DocAnnotationFlashcardTaskAction>> => {

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

    const tasks: ReadonlyArray<Task<DocAnnotationFlashcardTaskAction>> = [
        {
            id: "10102",
            action: createClozeAction('The capital of California is {{c1::Sacramento}}.'),
            created: ISODateTimeStrings.create(),
            color: 'red',
            mode: 'flashcard'
        },
        {
            id: "10103",
            action: createFrontAndBackAction('What is the capital of the United States? ', 'Washington, DC'),
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

const ReviewerStats = observer(() => {

    const store = useDocAnnotationReviewerStore();

    return (
        <div>
            <b>suspended:</b> {store.hasSuspended ? 'true' : 'false'} <br/>
            <b>finished:</b> {store.hasFinished ? 'true' : 'false'} <br/>
            <b>ratings:</b> {store.ratings.join(', ')} <br/>
        </div>
    );
});

export const ReviewerStory = () => {

    const [open, setOpen] = React.useState(false);
    const dialogManager = useDialogManager();

    const doRating: Reviewers.IReviewer<DocAnnotationTaskAction>['doRating'] = React.useCallback(async (taskRep, rating) => {
        console.log("onRating: ", { taskRep, rating });
    }, []);

    const doSuspended: Reviewers.IReviewer<DocAnnotationTaskAction>['doSuspended'] = React.useCallback(async (taskRep) => {
        console.log("onSuspended: ", { taskRep });
    }, []);

    const doFinished: Reviewers.IReviewer<DocAnnotationTaskAction>['doFinished'] = React.useCallback(async () => {
        console.log("onFinished: ");
    }, []);


    const store = React.useMemo(() => {
        return new ReviewerStore<DocAnnotationTaskAction>({
            taskReps,
            doSuspended,
            doFinished,
            doRating,
            dialogManager: dialogManager,
        });
    }, [doFinished, doSuspended, doRating, dialogManager]);

    return (

        <StoryHolder>
            <BrowserRouter key="browser-router">
                <Switch location={ReactRouters.createLocationWithPathAndHash()}>
                    <DocAnnotationReviewerStoreContext.Provider value={store}>
                        {open && (
                            <ReviewerRunner store={store} />)}

                        <Button variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => setOpen(true)}>
                            Start Review
                        </Button>

                        <ReviewerStats/>

                    </DocAnnotationReviewerStoreContext.Provider>
                </Switch>
            </BrowserRouter>
        </StoryHolder>

    );
};
