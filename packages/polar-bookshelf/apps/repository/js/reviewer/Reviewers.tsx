import * as React from "react";
import {ReviewerTasks} from "./ReviewerTasks";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {SpacedRep, SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {
    Rating,
    RepetitionMode,
    StageCountsCalculator,
    TaskRep
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {
    CalculatedTaskReps,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Logger} from "polar-shared/src/logger/Logger";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Preconditions} from "polar-shared/src/Preconditions";
import {
    SpacedRepStat,
    SpacedRepStats
} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {ReadingTaskAction} from "./cards/ReadingTaskAction";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {IFirestoreContext} from "../FirestoreProvider";

const log = Logger.create();

export const DEFAULT_LIMIT = 10;

export namespace Reviewers {

    export interface IReviewer {
        readonly taskReps: ReadonlyArray<TaskRep<any>>;
        readonly doFinished: () => Promise<void>;
        readonly doSuspended: (taskRep: TaskRep<any>) => Promise<void>;
        readonly doRating: (taskRep: TaskRep<any>, rating: Rating) => Promise<void>;
    }

    export interface IReviewerCreateOpts {
        readonly firestore: IFirestoreContext;
        readonly annotations: ReadonlyArray<IDocAnnotation>;
        readonly mode: RepetitionMode;
        readonly onClose?: Callback;
        readonly limit?: number;
    }

    export async function create(opts: IReviewerCreateOpts): Promise<IReviewer> {

        const {annotations, mode, firestore} = opts;
        const limit = opts.limit || DEFAULT_LIMIT;
        const onClose = opts.onClose || NULL_FUNCTION;

        Preconditions.assertPresent(mode, 'mode');

        const uid = firestore.uid;

        if (! uid) {
            throw new Error("Not logged in");
        }

        const calculateTaskReps = async (): Promise<CalculatedTaskReps<any>> => {
            switch (mode) {
                case "flashcard":
                    return await ReviewerTasks.createFlashcardTasks(annotations, limit);
                case "reading":
                    return await ReviewerTasks.createReadingTasks(annotations, limit);
            }
        };


        const calculatedTaskReps = await calculateTaskReps();
        const {taskReps} = calculatedTaskReps;

        const doWriteQueueStageCounts = async () => {

            const spacedRepStats: SpacedRepStat = {
                created: ISODateTimeStrings.create(),
                type: 'queue',
                mode,
                ...calculatedTaskReps.stageCounts
            };

            await SpacedRepStats.write(uid, spacedRepStats);

        };

        await doWriteQueueStageCounts();

        console.log("Found N tasks: " + taskReps.length);

        const completedStageCounts = StageCountsCalculator.createMutable();

        const incrCompletedStageCounts = (taskRep: TaskRep<any>) => {

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

            await SpacedRepStats.write(uid, spacedRepStats);

            console.log("Wrote completed state counts");

        };

        const doWriteSuspendedCounts = async (taskRep: TaskRep<ReadingTaskAction>) => {

            const convertedSpacedRep = SpacedReps.convertFromTaskRep(uid, taskRep);
            const spacedRep: SpacedRep = {
                ...convertedSpacedRep,
                suspended: true
            };

            await SpacedReps.set(taskRep.id, spacedRep);

        }

        const doFinished = async () => {

            console.log("Got finished...");

            doWriteCompletedStageCounts()
                .catch(err => log.error("Unable to write completed stage counts: ", err));

            onClose();

        };

        const doSuspended = async (taskRep: TaskRep<any>) => {
            await doWriteSuspendedCounts(taskRep);
        };

        const doRating = async (taskRep: TaskRep<any>, rating: Rating) => {

            console.log("Saving rating... ");

            const next = TasksCalculator.computeNextSpacedRep(taskRep, rating);

            const spacedRep: SpacedRep = Dictionaries.onlyDefinedProperties({uid, ...next});

            incrCompletedStageCounts(taskRep);

            await SpacedReps.set(next.id, spacedRep)

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
