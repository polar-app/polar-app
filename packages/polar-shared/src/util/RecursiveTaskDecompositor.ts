/**
 * Takes a task, applies a transformation function repeatedly, and terminates on convergence.
 *
 * This can be done to break up tasks recursively into smaller and smaller tasks
 * and then collect the results at the end after convergence.
 *
 * Two functions have to be given, a decompose function, and a converted
 * function which tells if if we've finished.
 */
export namespace RecursiveTaskDecompositor {

    interface ICreateOpts<V> {
        readonly decompose: (value: V) => Promise<V>;
        readonly converged: (value: V) => boolean;
    }

    export function create<V>(opts: ICreateOpts<V>) {

        return async (value: V): Promise<V> => {

            const {decompose, converged} = opts;
            while(! converged(value)) {
                value = await decompose(value)
            }

            return value;

        }

    }

}
