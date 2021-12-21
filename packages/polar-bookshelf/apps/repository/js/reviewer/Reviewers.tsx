import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {SpacedRep, SpacedRepCollection} from "polar-firebase/src/firebase/om/SpacedRepCollection";
import {
    Rating,
    RepetitionMode,
    StageCountsCalculator,
    TaskRep
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator2";
import {Logger} from "polar-shared/src/logger/Logger";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Preconditions} from "polar-shared/src/Preconditions";
import {SpacedRepStat, SpacedRepStatCollection} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {IFirestoreContext} from "../FirestoreProvider";
import {ICalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ICalculatedTaskReps";

const log = Logger.create();

export namespace Reviewers {

    export interface IReviewer<T> {
        readonly taskReps: ReadonlyArray<TaskRep<T>>;
        readonly doFinished: () => Promise<void>;
        readonly doSuspended: (taskRep: TaskRep<T>) => Promise<void>;
        readonly doRating: (taskRep: TaskRep<T>, rating: Rating) => Promise<void>;
    }

    export interface IReviewerCreateOpts<T> {
        readonly firestore: IFirestoreContext;
        readonly data: ICalculatedTaskReps<T>;
        readonly mode: RepetitionMode;
        readonly onClose?: Callback;
    }

    export async function create<T>(opts: IReviewerCreateOpts<T>): Promise<IReviewer<T>> {

        const {data, mode, firestore} = opts;
        const onClose = opts.onClose || NULL_FUNCTION;

        Preconditions.assertPresent(mode, 'mode');

        const uid = firestore.uid;

        if (! uid) {
            throw new Error("Not logged in");
        }


        const {taskReps} = data;

        const doWriteQueueStageCounts = async () => {

            const spacedRepStats: SpacedRepStat = {
                created: ISODateTimeStrings.create(),
                type: 'queue',
                mode,
                ...data.stageCounts
            };

            await SpacedRepStatCollection.write(firestore.firestore, uid, spacedRepStats);

        };

        await doWriteQueueStageCounts();

        console.log("Found N tasks: " + taskReps.length);

        const completedStageCounts = StageCountsCalculator.createMutable();

        const incrCompletedStageCounts = (taskRep: TaskRep<T>) => {

            switch (taskRep.stage) {
                case "new":
                    ++completedStageCounts.nrNew;
                    break;
                case "learning":
                    ++completedStageCounts.nrLearning;
                    break;
                case "review":
                    ++completedStageCounts.nrReview;
                    break;
                case "lapsed":
                    ++completedStageCounts.nrLapsed;
                    break;
            }

        };

        const doWriteCompletedStageCounts = async () => {

            const spacedRepStats: SpacedRepStat = {
                created: ISODateTimeStrings.create(),
                type: 'completed',
                mode,
                ...completedStageCounts
            };

            await SpacedRepStatCollection.write(firestore.firestore, uid, spacedRepStats);

            console.log("Wrote completed state counts");

        };

        const doWriteSuspendedCounts = async (taskRep: TaskRep<T>) => {

            const convertedSpacedRep = SpacedRepCollection.convertFromTaskRep(uid, taskRep);
            const spacedRep: SpacedRep = {
                ...convertedSpacedRep,
                suspended: true
            };

            await SpacedRepCollection.set(firestore.firestore, taskRep.id, spacedRep);

        }

        const doFinished = async () => {

            console.log("Got finished...");

            doWriteCompletedStageCounts()
                .catch(err => log.error("Unable to write completed stage counts: ", err));

            onClose();

        };

        const doSuspended = async (taskRep: TaskRep<T>) => {
            await doWriteSuspendedCounts(taskRep);
        };

        const doRating = async (taskRep: TaskRep<T>, rating: Rating) => {

            console.log("Saving rating... ");

            const next = TasksCalculator.computeNextSpacedRep(taskRep, rating);

            const spacedRep: SpacedRep = Dictionaries.onlyDefinedProperties({uid, ...next});

            incrCompletedStageCounts(taskRep);

            await SpacedRepCollection.set(firestore.firestore, next.id, spacedRep)

        };

        // emit stats that the reviewer was run...
        Analytics.event({category: 'reviewer', action: 'created-' + mode});

        return {
            taskReps,
            doRating,
            doSuspended,
            doFinished
        };

    }

}
