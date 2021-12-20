import React from 'react';
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TasksBuilder} from "./ReviewerTasks";
import {useSpacedRepCollectionSnapshot} from "./UseSpacedRepCollectionSnapshot";

export function useReviewerTasksCreator() {

    const spacedRepsSnapshot = useSpacedRepCollectionSnapshot();

    return React.useCallback(<A, B>(data: ReadonlyArray<A>,
                                    mode: RepetitionMode,
                                    tasksBuilder: TasksBuilder<A, B>,
                                    limit: number = 10) => {
        //
        // Preconditions.assertPresent(mode, 'mode');
        //
        // // TODO: we also need to be able to review images.... we also need a dedicated provider to
        // // return the right type of annotation type...
        //
        // const potential: ReadonlyArray<Task<B>> = tasksBuilder(data);
        //
        // const spacedRepsMap = IDMaps.create(spacedReps);
        //
        // const optionalTaskRepResolver: OptionalTaskRepResolver<B> = (task: Task<B>): TaskRep<B> | undefined => {
        //
        //     const spacedRep = spacedRepsMap[task.id];
        //
        //     if (! spacedRep) {
        //         return undefined;
        //     }
        //
        //     const age = TasksCalculator.computeAge(spacedRep);
        //
        //     return {...task, ...spacedRep, age};
        //
        // };
        //
        // const resolver = createDefaultTaskRepResolver(optionalTaskRepResolver);
        //
        // return TasksCalculator.calculate({
        //     potential,
        //     resolver,
        //     limit
        // });

    }, []);

}
