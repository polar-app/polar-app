import {Reviewer} from "./Reviewer";
import {ReactInjector} from "../../../../web/js/ui/util/ReactInjector";
import * as React from "react";
import {ReviewerTasks} from "./ReviewerTasks";
import {RepoAnnotation} from "../RepoAnnotation";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class Reviewers {

    public static async create(repoDocAnnotations: ReadonlyArray<RepoAnnotation>, limit: number = 10) {

        const tasks = await ReviewerTasks.createTasks(repoDocAnnotations, limit);

        const injected = ReactInjector.inject(<Reviewer tasks={tasks} onAnswer={NULL_FUNCTION} onFinished={NULL_FUNCTION}/>);

    }

}
