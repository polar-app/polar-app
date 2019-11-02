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

export class Reviewers {

    public static async create(repoDocAnnotations: ReadonlyArray<RepoAnnotation>, limit: number = 10) {

        const firestore = await Firestore.getInstance();

        SpacedReps.firestoreProvider = () => firestore as any as FirestoreLike;

        const tasks = await ReviewerTasks.createTasks(repoDocAnnotations, limit);

        console.log("Found N tasks: " + tasks.length);

        let injected: InjectedComponent | undefined;

        const doClose = () => {
            injected!.destroy();
        };

        const onFinished = () => {
            doClose();
        };

        injected = ReactInjector.inject(
            <LightModal>
                <Reviewer tasks={tasks}
                          onAnswer={NULL_FUNCTION}
                          onFinished={onFinished}/>
            </LightModal>);

    }

}
