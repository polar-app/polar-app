import * as React from 'react';
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
import {ReviewerRunner} from "../../repository/js/reviewer/ReviewerRunner";
import {Reviewers} from "../../repository/js/reviewer/Reviewers";
import {ReviewerStore, ReviewerStoreContext, useReviewerStore} from "../../repository/js/reviewer/ReviewerStore";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {observer} from "mobx-react-lite";
import {BlockContentAnnotationTree} from "polar-migration-block-annotations/src/BlockContentAnnotationTree";
import {ReviewerDialog} from "../../repository/js/reviewer/ReviewerDialog";
import {ITaskAction} from "../../repository/js/reviewer/ITaskAction";

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


const createFlashcardTaskReps = () => {

    const docMeta = MockDocMetas.createMockDocMeta();
    const pageMeta = Object.values(docMeta.pageMetas)[0];
    const ref = Refs.create('1234', 'text-highlight');

    const createFrontAndBackAction = (front: string, back: string) => {

        const flashcard = Flashcards.createFrontBack(front, back, ref);
        const blockFlashcard = BlockContentAnnotationTree
            .annotationToBlockFlashcard(flashcard);
        const docAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions.create(blockFlashcard, docAnnotation);
        return flashcardTaskActions[0];
    };

    const createClozeAction = (text: HTMLStr) => {
        const flashcard = Flashcards.createCloze(text, ref);
        const blockFlashcard = BlockContentAnnotationTree
            .annotationToBlockFlashcard(flashcard);
        const docAnnotation = DocAnnotations.createFromFlashcard(docMeta, flashcard, pageMeta);
        const flashcardTaskActions = FlashcardTaskActions.create(blockFlashcard, docAnnotation);
        return flashcardTaskActions[0];
    };

    const tasks = [
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

    return tasks.map(task => TasksCalculator.createInitialLearningState(task as any));

};

const taskReps = createFlashcardTaskReps();

const ReviewerStats = observer(() => {

    const store = useReviewerStore();

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

    const doRating: Reviewers.IReviewer<ITaskAction>['doRating'] = React.useCallback(async (taskRep, rating) => {
        console.log("onRating: ", { taskRep, rating });
    }, []);

    const doSuspended: Reviewers.IReviewer<ITaskAction>['doSuspended'] = React.useCallback(async (taskRep) => {
        console.log("onSuspended: ", { taskRep });
    }, []);

    const doFinished: Reviewers.IReviewer<ITaskAction>['doFinished'] = React.useCallback(async () => {
        console.log("onFinished: ");
    }, []);


    const store = React.useMemo(() => {
        return new ReviewerStore<ITaskAction>({
            taskReps: taskReps as any,
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
                    <ReviewerStoreContext.Provider value={store}>

                        {open && (
                            <ReviewerDialog onClose={() => setOpen(false)}>
                                <ReviewerRunner store={store} />
                            </ReviewerDialog>)}

                        {! open && (
                            <Button variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => setOpen(true)}>
                                Start Review
                            </Button>)}

                        <ReviewerStats/>

                    </ReviewerStoreContext.Provider>
                </Switch>
            </BrowserRouter>
        </StoryHolder>

    );
};
