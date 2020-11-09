import * as React from 'react';
import {IntersectionListItem} from "./IntersectionListItem";

export type RefCallback = (element: HTMLElement | HTMLDivElement | null) => void;

export interface IntersectionListComponentProps<V extends ListValue> {

    /**
     * Called when we have a ref to the component
     */
    readonly innerRef: RefCallback;

    readonly value: V;

    /**
     * True if the component is in the viewport.
     */
    readonly inView: boolean;

}

export type IntersectionListComponent<V extends ListValue> = (props: IntersectionListComponentProps<V>) => JSX.Element;

export interface ListValue {

    /**
     * The object must have a unique ID so that we can have a key in a the component array.
     */
    readonly id: string;

}

interface IProps<V extends ListValue> {

    /**
     * The IntersectionObserver interface's read-only root property identifies
     * the Element or Document whose bounds are treated as the bounding box of
     * the viewport for the element which is the observer's target. If the root
     * is null, then the bounds of the actual document viewport are used.
     */
    readonly root: HTMLElement;

    readonly values: ReadonlyArray<V>;

    readonly component: IntersectionListComponent<V>;

}

/**
 * Intersection listener that uses 'blocks' of components
 *
 * There are two main intersection observers that we could use.
 *
 * https://github.com/thebuilder/react-intersection-observer#readme
 * https://github.com/researchgate/react-intersection-observer
 */
export const IntersectionList = function<V extends ListValue>(props: IProps<V>) {

    return (
        <>
            {props.values.map(current => (
                <IntersectionListItem key={current.id}
                                      root={props.root}
                                      value={current}
                                      component={props.component}/>

            ))}
        </>
    );

};