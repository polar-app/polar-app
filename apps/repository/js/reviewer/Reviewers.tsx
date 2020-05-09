import {Reviewer} from "./Reviewer";
import {
    InjectedComponent,
    ReactInjector
} from "../../../../web/js/ui/util/ReactInjector";
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
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Latch} from "polar-shared/src/util/Latch";
import {PreviewWarnings} from "./PreviewWarnings";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {DatastoreCapabilities} from "../../../../web/js/datastore/Datastore";
import {Preconditions} from "polar-shared/src/Preconditions";
import {
    SpacedRepStat,
    SpacedRepStats
} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {FirestoreCollections} from "./FirestoreCollections";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {ReadingTaskAction} from "./cards/ReadingTaskAction";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ReviewerDialog} from "./ReviewerDialog";
import {CloudSyncRequired, NoTasks} from "./ReviewFinished";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

const log = Logger.create();

export const DEFAULT_LIMIT = 10;

class FlashcardFilters {

    public static cloze(repoDocAnnotations: ReadonlyArray<IDocAnnotation>) {
        return repoDocAnnotations.filter(current => current.annotationType === AnnotationType.FLASHCARD)
                                 .filter(current => (current.original as IFlashcard).type === FlashcardType.CLOZE);
    }
}


export class Reviewers {

    public static start(datastoreCapabilities: DatastoreCapabilities,
                        prefs: PersistentPrefs,
                        repoDocAnnotations: ReadonlyArray<IDocAnnotation>,
                        mode: RepetitionMode,
                        limit: number = DEFAULT_LIMIT) {

        // FIXME: use the new component injector here...

        this.createAndInject(datastoreCapabilities, prefs, repoDocAnnotations, mode, limit)
            .catch(err => console.error("Unable to start review: ", err));

    }


    private static async notifyPreview(prefs: PersistentPrefs) {
        const latch = new Latch();

        await PreviewWarnings.doWarning(prefs, () => latch.resolve(true));

        await latch.get();
    }

    /**
     *
     * @Deprecated
     */
    public static async createAndInject(datastoreCapabilities: DatastoreCapabilities,
                                        prefs: PersistentPrefs,
                                        repoDocAnnotations: ReadonlyArray<IDocAnnotation>,
                                        mode: RepetitionMode,
                                        limit: number = DEFAULT_LIMIT) {

        let injected: InjectedComponent | undefined;

        const doClose = () => {
            injected!.destroy();
        };

        const reviewer = await this.create(datastoreCapabilities, prefs, repoDocAnnotations, mode, doClose, limit);

        if (reviewer) {

            injected = ReactInjector.inject(reviewer);
        }

    }


    public static async create(datastoreCapabilities: DatastoreCapabilities,
                               prefs: PersistentPrefs,
                               repoDocAnnotations: ReadonlyArray<IDocAnnotation>,
                               mode: RepetitionMode,
                               doClose: Callback = NULL_FUNCTION,
                               limit: number = DEFAULT_LIMIT): Promise<JSX.Element> {

        Preconditions.assertPresent(mode, 'mode');

        const uid = await Firebase.currentUserID();

        if (! datastoreCapabilities.networkLayers.has('web')) {
            return (
                <ReviewerDialog>
                    <CloudSyncRequired/>
                </ReviewerDialog>
            );

        }

        if (! uid) {
            throw new Error("Not authenticated");
        }

        await FirestoreCollections.configure();

        // await this.notifyPreview(prefs);

        const calculateTaskReps = async (): Promise<CalculatedTaskReps<any>> => {
            switch (mode) {
                case "flashcard":
                    return await ReviewerTasks.createFlashcardTasks(repoDocAnnotations, limit);
                case "reading":
                    return await ReviewerTasks.createReadingTasks(repoDocAnnotations, limit);
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

        if (taskReps.length === 0) {
            return (
                <ReviewerDialog>
                    <NoTasks/>
                </ReviewerDialog>
            );
        }

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

            SpacedReps.set(taskRep.id, spacedRep)
                      .catch(err => log.error("Could not save state: ", err));

        }

        // FIXME: when done, redirect to /annotations ... but I don't know how to do this without a <Link>

        const onFinished = () => {

            console.log("Got finished...");

            doWriteCompletedStageCounts()
                .catch(err => log.error("Unable to write completed stage counts: ", err));

            doClose();

        };

        const onSuspended = async (taskRep: TaskRep<ReadingTaskAction>) => {
            await doWriteSuspendedCounts(taskRep);
        };

        const onRating = (taskRep: TaskRep<any>, rating: Rating) => {

            console.log("Saving rating... ");

            const next = TasksCalculator.computeNextSpacedRep(taskRep, rating);

            const spacedRep: SpacedRep = Dictionaries.onlyDefinedProperties({uid, ...next});

            incrCompletedStageCounts(taskRep);

            SpacedReps.set(next.id, spacedRep)
                .then(() => console.log("Saving rating... done", JSON.stringify(spacedRep, null, '  ')))
                .catch(err => log.error("Could not save state: ", err));

        };

        // emit stats that the reviewer was run...
        Analytics.event({category: 'reviewer', action: 'created-' + mode});

        return (
            <Reviewer taskReps={taskReps}
                      onRating={onRating}
                      onSuspended={onSuspended}
                      onFinished={onFinished}/>
        );

    }


}
