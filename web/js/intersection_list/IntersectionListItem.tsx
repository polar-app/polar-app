import * as React from 'react';
import {IntersectionListComponent, ListValue} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';

export interface IntersectionListItem<V extends ListValue> {

    readonly root: HTMLElement;

    readonly value: V;

    readonly component: IntersectionListComponent<V>;

}

// FIXME this isn't memoized due to generics... issues.

/**
 * Intersection listener that uses 'blocks' of components
 *
 */
export const IntersectionListItem = function<V extends ListValue>(props: IntersectionListItem<V>) {

    const Component = props.component;

    const {ref, inView, entry} = useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root: props.root
    });

    return (
        <Component value={props.value} innerRef={ref} inView={inView}/>
    );

};
