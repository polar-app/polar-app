import * as React from 'react';
import {VisibleComponent, ListValue, HiddenComponent} from "./IntersectionList";

export interface IntersectionListItem<V extends ListValue> {

    readonly root: HTMLElement;

    readonly value: V;

    readonly visibleComponent: VisibleComponent<V>;

    readonly hiddenComponent: HiddenComponent<V>;

    readonly inView: boolean;

}

/**
 * Intersection listener that uses 'blocks' of components
 *
 */
export const IntersectionListBlockItem = function<V extends ListValue>(props: IntersectionListItem<V>) {

    const VisibleComponent = props.visibleComponent;
    const HiddenComponent = props.hiddenComponent;

    if (props.inView) {
        return (
            <VisibleComponent value={props.value}/>
        );
    } else {
        return (
            <HiddenComponent value={props.value}/>
        );
    }

};
