import React from 'react';
import {RepetitionMode, Task, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TasksBuilder} from "./ReviewerTasks";
import {useSpacedRepCollectionSnapshot} from "./UseSpacedRepCollectionSnapshot";
import {Preconditions} from "polar-shared/src/Preconditions";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
    TasksCalculator2
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator2";

export function useReviewerTasksCreator() {

    const spacedRepsSnapshot = useSpacedRepCollectionSnapshot();

    return React.useCallback(<A, B>(data: ReadonlyArray<A>,
                                    mode: RepetitionMode,
                                    tasksBuilder: TasksBuilder<A, B>,
                                    limit: number = 10) => {

        Preconditions.assertPresent(mode, 'mode');

        // TODO: we also need to be able to review images.... we also need a dedicated provider to
        // return the right type of annotation type...

        const potential: ReadonlyArray<Task<B>> = tasksBuilder(data);

        const docs = spacedRepsSnapshot.right ? spacedRepsSnapshot.right.docs.map(current => current.data()) : [];

        const spacedRepsMap = IDMaps.create(docs);

        const optionalTaskRepResolver: OptionalTaskRepResolver<B> = (task: Task<B>): TaskRep<B> | undefined => {

            const spacedRep = spacedRepsMap[task.id];

            if (! spacedRep) {
                return undefined;
            }

            const age = TasksCalculator2.computeAge(spacedRep);

            return {
                ...task, ...spacedRep, age
            };

        };

        const resolver = createDefaultTaskRepResolver(optionalTaskRepResolver);

        if (spacedRepsSnapshot.left) {
            // we have an error in the snapshot so we can't continue.
            throw spacedRepsSnapshot.left;
        }

        return TasksCalculator2.calculate({
            potential,
            resolver,
            limit
        });

    }, [spacedRepsSnapshot.left, spacedRepsSnapshot.right]);

}
