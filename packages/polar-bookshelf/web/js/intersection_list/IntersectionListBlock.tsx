import * as React from 'react';
import {BlockComponent, ListValue, RefCallback, VisibleComponent, HiddenBlockComponent} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';
import {IntersectionListBlockItem} from "./IntersectionListBlockItem";
import {typedMemo} from "../hooks/ReactHooks";

interface IProps<V extends ListValue> {

    readonly root: HTMLElement;

    readonly values: ReadonlyArray<V>;

    readonly blockSize: number;

    readonly blockIndex: number;

    readonly BlockComponent: BlockComponent<V>;

    readonly VisibleComponent: VisibleComponent<V>;

    readonly HiddenBlockComponent: HiddenBlockComponent<V>;

}

interface IViewState {
    readonly ref: (node?: Element | null | undefined) => void;
    readonly inView: boolean;
}

interface IntersectionObserverViewStateOpts {
    readonly root: HTMLElement;

    // when true we never update the state.
    readonly inactive?: boolean;
}

function useIntersectionObserverViewState(opts: IntersectionObserverViewStateOpts): IViewState {

    const {root} = opts;

    const [inView, setUseInView] = React.useState(false);

    const observation = useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root
    });

    // if (observation.inView !== inView) {
    //     setUseInView(observation.inView);
    // }

    if (observation.inView && ! inView) {
        // only go one way ... then don't deactivate...
        if (! opts.inactive) {
            setUseInView(true);
        }
    }

    return {
        ref: observation.ref,
        inView
    };

}

export function useIntersectionObserverUsingCalculationViewState(opts: IntersectionObserverViewStateOpts) {

    const {ref, inView, entry} = useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root: opts.root
    });

    //
    // function computeInView() {
    //
    //     const buffer = window.outerHeight * 0.5;
    //
    //     if (! entry) {
    //         return false;
    //     }
    //
    //     const line = new Line(0 - buffer, window.outerHeight + buffer, 'y');
    //
    //     if (line.containsPoint(entry.boundingClientRect.top)) {
    //         console.log(`FIXME top: ${entry.boundingClientRect.top} [${line.start}, ${line.end}]`);
    //         return true;
    //     }
    //
    //     if (line.containsPoint(entry.boundingClientRect.bottom)) {
    //         console.log(`FIXME bottom: ${entry.boundingClientRect.bottom} [${line.start}, ${line.end}]`);
    //         return true;
    //     }
    //
    //     return true;
    //
    // }
    //
    // const inView = computeInView();
}


export const IntersectionListBlock = typedMemo(function<V extends ListValue>(props: IProps<V>) {

    // TODO we have to detect if the parent of the intersection list is hidden and then disable
    // the inner view changing...

    // const rootViewState = useIntersectionObserverViewState({element: props.root});

    // TODO: change this BACK to root I think
    const {ref, inView} = useIntersectionObserverViewState({root: props.root});

    return (
        <LazyBlockComponent innerRef={ref}
                            inView={inView}
                            values={props.values}
                            VisibleComponent={props.VisibleComponent}
                            BlockComponent={props.BlockComponent}
                            HiddenBlockComponent={props.HiddenBlockComponent}
                            blockSize={props.blockSize}
                            blockIndex={props.blockIndex}
                            root={props.root}/>
    );
});

export interface LazyBlockComponentProps<V extends ListValue> extends IProps<V> {
    readonly innerRef: RefCallback;
    readonly inView: boolean;
}

/**
 * Used so that we're doing the rendering here and we can memoize it so that a re-render due to inView changing
 * won't re-render the component itself due to props not changing.
 */
export const LazyBlockComponent = typedMemo(function<V extends ListValue>(props: LazyBlockComponentProps<V>) {

    const {BlockComponent, HiddenBlockComponent} = props;

    const indexBase = props.blockIndex * props.blockSize;

    return (
        <>
            <BlockComponent innerRef={props.innerRef} values={props.values}>
                 <>
                    {props.inView && props.values.map((current, index) => (
                        <IntersectionListBlockItem key={indexBase + index}
                                                   root={props.root}
                                                   value={current}
                                                   index={indexBase + index}
                                                   VisibleComponent={props.VisibleComponent}/>
                    ))}

                     {! props.inView && (
                         <HiddenBlockComponent index={indexBase}
                                               values={props.values}/>)}

                 </>
            </BlockComponent>

        </>
    );

});