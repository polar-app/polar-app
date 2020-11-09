import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';
import {IntersectionListComponent, ListValue} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';

interface IProps<V extends ListValue> {

    /**
     * The IntersectionObserver interface's read-only root property identifies
     * the Element or Document whose bounds are treated as the bounding box of
     * the viewport for the element which is the observer's target. If the root
     * is null, then the bounds of the actual document viewport are used.
     */
    readonly root: HTMLElement;

    readonly value: V;

    readonly component: IntersectionListComponent<V>;

}

/**
 * Intersection listener that uses 'blocks' of components
 */
export const IntersectionListItem = deepMemo(function<V extends ListValue>(props: IProps<V>) {

    const Component = props.component;

    const { ref, inView, entry } = useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 50,
        root: props.root
    });

    return (
        <Component key={props.value.id} value={props.value} ref={ref} inView={inView}/>
    );

});
