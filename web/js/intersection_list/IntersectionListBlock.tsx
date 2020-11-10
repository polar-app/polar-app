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

export const IntersectionListBlock = typedMemo(function<V extends ListValue>(props: IProps<V>) {

    const BlockComponent = props.blockComponent;

    const {ref, entry} = useInView({
        threshold: 0,
        root: props.root
    });

    function computeInView() {

        const buffer = window.outerHeight * 0.5;

        if (! entry) {
            return false;
        }

        const line = new Line(0 - buffer, window.outerHeight + buffer, 'y');

        if (line.containsPoint(entry.boundingClientRect.top)) {
            return true;
        }

        if (line.containsPoint(entry.boundingClientRect.bottom)) {
            return true;
        }

        return true;

    }

    const inView = computeInView();

    const indexBase = props.blockIndex * props.blockSize;

    // FIXME: we can use just the

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