import {RepoAnnotation} from "../RepoAnnotation";
import {
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
    Task,
    TaskRep,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";

export class ReviewerTasks {

    public static async createTasks(repoDocAnnotations: ReadonlyArray<RepoAnnotation>, limit: number = 10) {

        const potential: ReadonlyArray<Task> =
            repoDocAnnotations.filter(current => current.type === AnnotationType.TEXT_HIGHLIGHT)
                              .filter(current => current.text !== undefined && current.text !== '')
                              .map(current => {

                                  const color = HighlightColors.toDefaultColor((current.meta || {}).color);
                                  return {
                                      ...current,
                                      text: current.text || "",
                                      color
                                  };
                              });


        // TODO: using an AsyncWorkQueue would be better/faster.

        const optionalTaskRepResolver: OptionalTaskRepResolver  = async (task: Task): Promise<TaskRep | undefined> => {

            const spacedRep = await SpacedReps.get(task.id);

            if (! spacedRep) {
                return undefined;
            }

            const age = TasksCalculator.computeAge(spacedRep);

            return {...task, ...spacedRep, age};

        };

        const resolver = createDefaultTaskRepResolver(optionalTaskRepResolver);

        const tasks = await TasksCalculator.calculate({
            potential,
            resolver,
            limit
        });

        return tasks;

    }

}
