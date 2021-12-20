import {action, makeObservable, observable} from "mobx";
import React from "react";
import {Rating, RepetitionMode, ReviewRating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Reviewers} from "./Reviewers";
import {DialogManager} from "../../../../web/js/mui/dialogs/MUIDialogController";
import {useFirestore} from "../FirestoreProvider";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useRefWithUpdates} from "../../../../web/js/hooks/ReactHooks";
import {ITaskAction} from "./ReviewerTasks";
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";
import {ICalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ICalculatedTaskReps";


interface IReviewerStoreInitOpts<T> extends Reviewers.IReviewer<T> {
    dialogManager: DialogManager;
}

export class ReviewerStore<T = ITaskAction> {
    @observable currentTaskRep: ITaskRep<T> | undefined = undefined;
    @observable pending: ReadonlyArray<ITaskRep<T>>;
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

    @action onRating(taskRep: ITaskRep<T>, rating: Rating) {
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

export const ReviewerStoreContext = React.createContext<ReviewerStore<ITaskAction> | undefined>(undefined);

export const useReviewerStore = (): ReviewerStore<ITaskAction> => {
    const value = React.useContext(ReviewerStoreContext);

    if (! value) {
        throw new Error("useReviewerStore can only be called from within a component that's wrapped in ReviewerStoreProvider");
    }

    return value;
};

interface IReviewerStoreProviderOpts {
    readonly mode: RepetitionMode;
    readonly dataProvider: () => Promise<ICalculatedTaskReps<ITaskAction>>;
    readonly onClose?: () => void;
}

export const useReviewerStoreProvider = (opts: IReviewerStoreProviderOpts): ReviewerStore<ITaskAction> | undefined => {
    const { dataProvider, mode, onClose } = opts;
    const firestoreContext = useFirestore();
    const dialogManagerRef = useRefWithUpdates(useDialogManager())
    const [store, setStore] = React.useState<ReviewerStore<ITaskAction>>();

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
