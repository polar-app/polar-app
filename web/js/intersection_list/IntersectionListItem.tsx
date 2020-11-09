import * as React from 'react';
import {VisibleComponent, ListValue, HiddenComponent} from "./IntersectionList";
import { useInView } from 'react-intersection-observer';

export interface IntersectionListItem<V extends ListValue> {

    readonly root: HTMLElement;

    readonly value: V;

    readonly visibleComponent: VisibleComponent<V>;

    readonly hiddenComponent: HiddenComponent<V>;


}

// FIXME this isn't memoized due to generics... issues.

/**
 * Intersection listener that uses 'blocks' of components
 *
 */
export const IntersectionListItem = function<V extends ListValue>(props: IntersectionListItem<V>) {
// a
//     const Component = props.component;
//
//     // FIXME: this is the performance issue.  Without this it works just fine and a block strategy would
//     // work but I'd have to implement it.
//
//     // FIXME: trackVisibility doesn't seem to work with use
//     const {ref, inView, entry} = useInView({
//         threshold: 0,
//         trackVisibility: true,
//         delay: 100,
//         root: props.root
//     });
//
//     return (
//         <Component value={props.value} innerRef={ref} inView={inView}/>
//     );
    return null;

};
