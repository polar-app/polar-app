import * as React from 'react';
import {BlockComponent, HiddenComponent, ListValue, VisibleComponent} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';
import {IntersectionListBlockItem} from "./IntersectionListBlockItem";
import {typedMemo} from "../hooks/ReactHooks";
import {Line} from "../util/Line";

interface IProps<V extends ListValue> {

    readonly root: HTMLElement;

    readonly values: ReadonlyArray<V>;

    readonly blockComponent: BlockComponent<V>;

    readonly visibleComponent: VisibleComponent<V>;

    readonly hiddenComponent: HiddenComponent<V>;

    readonly blockSize: number;

    readonly blockIndex: number;

}

interface IViewState {
    readonly ref: (node?: Element | null | undefined) => void;
    readonly inView: boolean;
}

interface IntersectionObserverViewStateOpts {
    readonly root: HTMLElement;

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

    if (observation.inView !== inView) {
        // only fire when inView changes.
        setUseInView(observation.inView);
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

    const BlockComponent = props.blockComponent;

    const {ref, inView} = useIntersectionObserverViewState(props);

    const indexBase = props.blockIndex * props.blockSize;

    return (
        <BlockComponent innerRef={ref} values={props.values}>
            <>
                {props.values.map((current, index) => (
                    <IntersectionListBlockItem key={indexBase + index}
                                               root={props.root}
                                               value={current}
                                               index={indexBase + index}
                                               visibleComponent={props.visibleComponent}
                                               hiddenComponent={props.hiddenComponent}
                                               inView={inView}/>
                ))}

                {/*{! inView && (*/}
                {/*    <HiddenComponentBlock/>*/}
                {/*)}*/}
            </>
        </BlockComponent>
    )
});

interface Foo<V> {

}

//
// export const IntersectionListBlock<V> = React.memo(IntersectionListBlockDelegate) as React.FunctionComponent<IProps<V>>;