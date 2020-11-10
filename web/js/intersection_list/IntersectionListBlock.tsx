import * as React from 'react';
import {BlockComponent, HiddenComponent, ListValue, VisibleComponent} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';
import {IntersectionListBlockItem} from "./IntersectionListBlockItem";
import {typedMemo} from "../hooks/ReactHooks";

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

    const {ref, inView, entry} = useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root: props.root
    });

    const indexBase = props.blockIndex * props.blockSize;

    return (
        <BlockComponent innerRef={ref} values={props.values}>
            <>
                {props.values.map((current, index) => (
                    <IntersectionListBlockItem key={current.id}
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