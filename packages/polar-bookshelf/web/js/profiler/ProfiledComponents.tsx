import React, {Profiler, ProfilerOnRenderCallback} from 'react'

const IS_DEV = process.env.NODE_ENV === 'development';

export interface IRender {
    readonly id: string;
    readonly phase: string;
}

const RENDERS: IRender[] = [];

/**
 * Creates a snapshot of the internal render data and clears it so that future
 * tests don't see the same data.
 */
export function createRenderSnapshotAndReset() {
    const result = [...RENDERS];
    RENDERS.splice(0, RENDERS.length);
    return result;
}

// TODO: profile when a hook is updated too.

export function profiled<P = {}>(Component: React.FunctionComponent<P>): React.FunctionComponent<P> {

    if (IS_DEV) {

        return (props) => {

            const handleRender: ProfilerOnRenderCallback = React.useCallback((id, phase) => {
                console.log(`id: ${id}, phase: ${phase}`);
                RENDERS.push({id, phase});
            }, []);

            const id = React.useMemo(() => {

                if (Component.name) {
                    return Component.name;
                }

                if (Component.displayName) {
                    return Component.displayName;
                }

                if (typeof (Component as any).type === 'function') {

                    if (typeof (Component as any).type?.name === 'string') {
                        return (Component as any).type.name;
                    }

                }

                throw new Error("Component has no name");

            }, []);

            return (
                <Profiler id={id} onRender={handleRender}>
                    <Component {...props}/>
                </Profiler>
            );

        }

    } else {
        // just return the main component and don't wrap it because we aren't in
        // development mode.
        return Component;
    }

}
