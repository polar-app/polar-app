import {RepoAnnotation} from "../RepoAnnotation";
import {
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver, ReadTaskAction,
    Task,
    TaskRep,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export class ReviewerTasks {

    public static async createTasks(repoDocAnnotations: ReadonlyArray<RepoAnnotation>,
                                    mode: RepetitionMode,
                                    limit: number = 10) {

        // TODO: we also need to be able to review images.... we also need a dedicated provider to
        // return the right type of annotation type...

        const potential: ReadonlyArray<Task<ReadTaskAction>> =
            repoDocAnnotations.filter(current => current.type === AnnotationType.TEXT_HIGHLIGHT)
                              .filter(current => current.text !== undefined && current.text !== '')
                              .map(current => {

                                  const color = HighlightColors.withDefaultColor((current.meta || {}).color);
                                  return {
                                      ...current,
                                      action: current.text || "",
                                      color,
                                      mode
                                  };
                              });

        const uid = await Firebase.currentUserID();

        if (! uid) {
            throw new Error("Not authenticated");
        }

        const spacedReps = await SpacedReps.list(uid);

        const spacedRepsMap = IDMaps.toIDMap(spacedReps);

        const optionalTaskRepResolver: OptionalTaskRepResolver<ReadTaskAction>
            = async (task: Task<ReadTaskAction>): Promise<TaskRep<ReadTaskAction> | undefined> => {

            const spacedRep = spacedRepsMap[task.id];

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
