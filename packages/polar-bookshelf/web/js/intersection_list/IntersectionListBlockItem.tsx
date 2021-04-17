import * as React from 'react';
import {VisibleComponent, ListValue} from "./IntersectionList";
import {typedMemo} from "../hooks/ReactHooks";

export interface IntersectionListItem<V extends ListValue> {

    readonly root: HTMLElement;

    readonly value: V;

    readonly VisibleComponent: VisibleComponent<V>;

    readonly index: number;

}

/**
 * Intersection listener that uses 'blocks' of components
 *
 */
export const IntersectionListBlockItem = typedMemo(function<V extends ListValue>(props: IntersectionListItem<V>) {

    const {VisibleComponent} = props;

    return (
        <VisibleComponent value={props.value} index={props.index}/>
    );

});
