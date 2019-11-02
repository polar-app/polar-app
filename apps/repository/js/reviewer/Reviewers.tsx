import {Reviewer} from "./Reviewer";
import {InjectedComponent, ReactInjector} from "../../../../web/js/ui/util/ReactInjector";
import * as React from "react";
import {ReviewerTasks} from "./ReviewerTasks";
import {RepoAnnotation} from "../RepoAnnotation";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {Firestore} from "../../../../web/js/firebase/Firestore";
import {FirestoreLike} from "polar-firebase/src/firebase/Collections";
import {LightModal} from "../../../../web/js/ui/LightModal";
import {Answer} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TaskRep, TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Logger} from "polar-shared/src/logger/Logger";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

const log = Logger.create();

export class Reviewers {

    public static start(repoDocAnnotations: ReadonlyArray<RepoAnnotation>, limit: number = 10) {

        this.create(repoDocAnnotations, limit)
            .catch(err => console.error("Unable to start review: ", err));

    }

    public static async create(repoDocAnnotations: ReadonlyArray<RepoAnnotation>, limit: number = 10) {

        const firestore = await Firestore.getInstance();

        SpacedReps.firestoreProvider = () => firestore as any as FirestoreLike;

        const tasks = await ReviewerTasks.createTasks(repoDocAnnotations, limit);

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

        const onAnswer = (taskRep: TaskRep, answer: Answer) => {

            const next = TasksCalculator.computeNext(taskRep, answer);

            const spacedRep = Dictionaries.onlyDefinedProperties({uid, ...next});

            SpacedReps.set(next.id, spacedRep)
                .catch(err => log.error("Could not save state: ", err));

        };

        injected = ReactInjector.inject(
            <LightModal>
                <Reviewer tasks={tasks}
                          onAnswer={onAnswer}
                          onFinished={onFinished}/>
            </LightModal>);

    }

}
