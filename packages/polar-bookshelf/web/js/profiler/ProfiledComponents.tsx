import React, {Profiler, ProfilerOnRenderCallback} from 'react'

const isDev = process.env.NODE_ENV === 'development';

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

export function profiled<P = {}>(Component: React.FunctionComponent<P>): React.FunctionComponent<P> {


    if (isDev) {

        return (props) => {

            const handleRender: ProfilerOnRenderCallback = (id, phase) => {
                console.log(`id: ${id}, phase: ${phase}`);
                RENDERS.push({id, phase});
            }

            return (
                <Profiler id={Component.name || Component.displayName || 'unknown'} onRender={handleRender}>
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

const ObjectComponent: React.FunctionComponent<object> = () => {
    return (
        <div>hello world</div>
    )
}

const ObjectComponentProfiled = profiled(ObjectComponent);

interface IProps {
    readonly foo: string;
}

const WithProps = profiled((props: IProps) => (
    <div>hello {props.foo}</div>
));

const WithoutProps = profiled(() => (
    <div>hello</div>
));
