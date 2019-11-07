import {Reviewer} from "./Reviewer";
import {InjectedComponent, ReactInjector} from "../../../../web/js/ui/util/ReactInjector";
import * as React from "react";
import {ReviewerTasks} from "./ReviewerTasks";
import {RepoAnnotation} from "../RepoAnnotation";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {SpacedRep, SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {Firestore} from "../../../../web/js/firebase/Firestore";
import {FirestoreLike} from "polar-firebase/src/firebase/Collections";
import {LightModal} from "../../../../web/js/ui/LightModal";
import {Answer, Rating, RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {
    ReadTaskAction,
    TaskRep,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Logger} from "polar-shared/src/logger/Logger";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Latch} from "polar-shared/src/util/Latch";
import {PreviewWarnings} from "./PreviewWarnings";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {DatastoreCapabilities} from "../../../../web/js/datastore/Datastore";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";

const log = Logger.create();

export class Reviewers {

    public static start(datastoreCapabilities: DatastoreCapabilities,
                        prefs: PersistentPrefs,
                        repoDocAnnotations: ReadonlyArray<RepoAnnotation>,
                        mode: RepetitionMode,
                        limit: number = 10) {

        this.create(datastoreCapabilities, prefs, repoDocAnnotations, mode, limit)
            .catch(err => console.error("Unable to start review: ", err));

    }

    private static async configureFirestore() {

        if (SpacedReps.firestoreProvider) {
            return;
        }

        // TODO: dependency injection would rock here.

        const firestore = await Firestore.getInstance();
        SpacedReps.firestoreProvider = () => firestore as any as FirestoreLike;

    }

    private static async notifyPreview(prefs: PersistentPrefs) {
        const latch = new Latch();

        await PreviewWarnings.doWarning(prefs, () => latch.resolve(true));

        await latch.get();
    }

    private static displayWebRequiredError() {

        Dialogs.confirm({
            title: 'Cloud sync required',
            subtitle: 'Cloud sync is required to review annotations.  This is needed for mobile review.',
            type: 'danger',
            onConfirm: NULL_FUNCTION,
            noCancel: true
        });

    }

    private static displayNoTasksMessage() {

        Dialogs.confirm({
            title: 'No tasks to complete',
            subtitle: "Awesome.  Looks like you're all caught up and have no tasks to complete.",
            type: 'success',
            onConfirm: NULL_FUNCTION,
            noCancel: true
        });

    }

    public static async create(datastoreCapabilities: DatastoreCapabilities,
                               prefs: PersistentPrefs,
                               repoDocAnnotations: ReadonlyArray<RepoAnnotation>,
                               mode: RepetitionMode,
                               limit: number = 10) {

        if (! datastoreCapabilities.networkLayers.has('web')) {
            this.displayWebRequiredError();
            return;
        }

        await this.configureFirestore();

        await this.notifyPreview(prefs);

        const tasks = await ReviewerTasks.createTasks(repoDocAnnotations, mode, limit);

        if (tasks.length === 0) {
            this.displayNoTasksMessage();
            return;
        }

        console.log("Found N tasks: " + tasks.length);

        const uid = await Firebase.currentUserID();

        if (! uid) {
            throw new Error("Not authenticated");
        }

        let injected: InjectedComponent | undefined;

        const doClose = () => {
            injected!.destroy();
        };

        const onFinished = () => {
            doClose();
        };

        const onSuspended = (taskRep: TaskRep<ReadTaskAction>) => {

            const spacedRep = Dictionaries.onlyDefinedProperties({uid, ...taskRep, suspended: true});

            SpacedReps.set(taskRep.id, spacedRep)
                 .catch(err => log.error("Could not save state: ", err));

        };

        const onRating = (taskRep: TaskRep<ReadTaskAction>, rating: Rating) => {

            console.log("Saving rating... ");

            const next = TasksCalculator.computeNextSpacedRep(taskRep, rating);

            const spacedRep: SpacedRep = Dictionaries.onlyDefinedProperties({uid, ...next});

            SpacedReps.set(next.id, spacedRep)
                .then(() => console.log("Saving rating... done", JSON.stringify(spacedRep, null, '  ')))
                .catch(err => log.error("Could not save state: ", err));

        };

        injected = ReactInjector.inject(
            <LightModal>
                <Reviewer taskReps={tasks}
                          onRating={onRating}
                          onSuspended={onSuspended}
                          onFinished={onFinished}/>
            </LightModal>);

    }

}
