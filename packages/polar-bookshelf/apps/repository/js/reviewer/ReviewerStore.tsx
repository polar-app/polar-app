import {action, makeObservable, observable} from "mobx";
import React from "react";
import {CalculatedTaskReps, TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Rating, RepetitionMode, ReviewRating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Reviewers} from "./Reviewers";
import {DialogManager} from "../../../../web/js/mui/dialogs/MUIDialogController";
import {DocAnnotationTaskAction} from "./DocAnnotationReviewerTasks";
import {useFirestore} from "../FirestoreProvider";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useRefWithUpdates} from "../../../../web/js/hooks/ReactHooks";
import {TaskAction} from "./ReviewerTasks";


interface IReviewerStoreInitOpts<T> extends Reviewers.IReviewer<T> {
    dialogManager: DialogManager;
}

export class ReviewerStore<T = TaskAction> {
    @observable currentTaskRep: TaskRep<T> | undefined = undefined;
    @observable pending: ReadonlyArray<TaskRep<T>>;
    @observable finished: number;
    @observable total: number;

    @observable hasFinished: boolean = false;
    @observable hasSuspended: boolean = false;

    /**
     * The history of ratings (mostly for debug)
     */
    ratings: ReadonlyArray<ReviewRating>;

    private readonly doRating: IReviewerStoreInitOpts<T>['doRating'];
    private readonly doFinished: IReviewerStoreInitOpts<T>['doFinished'];
    private readonly doSuspended: IReviewerStoreInitOpts<T>['doSuspended'];

    private readonly dialogManager: DialogManager;

    constructor(opts: IReviewerStoreInitOpts<T>) {
        const {
            taskReps: [firstTaskRep, ...restTaskReps],
            doRating,
            doFinished,
            doSuspended,
            dialogManager,
        } = opts;

        this.pending = [...restTaskReps];
        this.finished = 0;
        this.total = opts.taskReps.length;
        this.currentTaskRep = firstTaskRep
        this.doRating = doRating;
        this.doFinished = doFinished;
        this.doSuspended = doSuspended;
        this.ratings = [];
        this.dialogManager = dialogManager;

        makeObservable(this);
    }

    @action onFinished() {
        this.hasFinished = true;
        this.handleAsyncCallback(this.doFinished);
    }

    @action onSuspended() {
        this.hasSuspended = true;

        const currentTaskRep = this.currentTaskRep;

        if (! currentTaskRep) {
            return;
        }

        this.handleAsyncCallback(async () => this.doSuspended(currentTaskRep));
    }

    @action onRating(taskRep: TaskRep<T>, rating: Rating) {
        this.handleAsyncCallback(async () => this.doRating(taskRep, rating));
        this.next(rating);
    }

    @action private next(rating: Rating): boolean {
        const [current, ...rest] = this.pending;
        this.currentTaskRep = current;
        this.pending = rest;

        this.finished += 1;
        this.ratings = [...this.ratings, rating];

        if (! current) {
            // We're done
            this.onFinished();
            return true;
        }

        return false;
    }

    private handleAsyncCallback(delegate: () => Promise<void>) {
        const handleError = (err: Error) =>
            this.dialogManager.snackbar({ type: 'error', message: err.message });

        delegate().catch(handleError)
    }

}

export const DocAnnotationReviewerStoreContext = React.createContext<ReviewerStore<DocAnnotationTaskAction> | undefined>(undefined);

export const useDocAnnotationReviewerStore = (): ReviewerStore<DocAnnotationTaskAction> => {
    const value = React.useContext(DocAnnotationReviewerStoreContext);

    if (! value) {
        throw new Error("useDocAnnotationReviewerStore can only be called from within a component that's wrapped in DocAnnotationReviewerStoreProvider");
    }

    return value;
};

interface IDocAnnotationReviewerStoreProviderOpts {
    readonly mode: RepetitionMode;
    readonly dataProvider: () => Promise<CalculatedTaskReps<DocAnnotationTaskAction>>;
    readonly onClose?: () => void;
}

export const useDocAnnotationReviewerStoreProvider = (opts: IDocAnnotationReviewerStoreProviderOpts): ReviewerStore<DocAnnotationTaskAction> | undefined => {
    const { dataProvider, mode, onClose } = opts;
    const firestoreContext = useFirestore();
    const dialogManagerRef = useRefWithUpdates(useDialogManager())
    const [store, setStore] = React.useState<ReviewerStore<DocAnnotationTaskAction>>();

    React.useEffect(() => {
        const createStore = async () => {
            const { taskReps, doRating, doSuspended, doFinished } = await Reviewers.create({
                firestore: firestoreContext!,
                onClose,
                data: await dataProvider(),
                mode,
            });

            return new ReviewerStore({
                taskReps,
                doSuspended,
                doFinished,
                doRating,
                dialogManager: dialogManagerRef.current,
            });
        };

        createStore()
            .then(setStore)
            .catch(console.error);
    }, [dataProvider, mode, onClose, firestoreContext, dialogManagerRef]);


    return store;
};
