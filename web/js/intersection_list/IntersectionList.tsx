import * as React from 'react';
import { deepMemo } from '../react/ReactUtils';

export type RefCallback = (element: HTMLElement | HTMLDivElement) => void;

export interface IntersectionListComponentProps<V extends ListValue> {

    /**
     * Called when we have a ref to the component
     */
    readonly ref: RefCallback;

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
export const IntersectionList = deepMemo(() => {


    return (
        <>
        </>
    );

});