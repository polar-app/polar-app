import * as React from 'react';
import {IntersectionListItem} from "./IntersectionListItem";
import { Arrays } from 'polar-shared/src/util/Arrays';
import { IntersectionListBlock } from './IntersectionListBlock';
import {FunctionComponent} from "react";

export type RefCallback = (element: HTMLElement | HTMLDivElement | null) => void;

export interface VisibleComponentProps<V extends ListValue> {

    readonly value: V;

}

/**
 * The component to render when we are visible
 */
export type VisibleComponent<V extends ListValue> = React.FunctionComponent<VisibleComponentProps<V>>;

export interface HiddenComponentProps<V extends ListValue> {

    readonly value: V;

}

/**
 * The component to render when the value is not visible.
 */
export type HiddenComponent<V extends ListValue> = React.FunctionComponent<HiddenComponentProps<V>>;

export interface BlockComponentProps<V extends ListValue> {

    /**
     * Called when we have a ref to the component
     */
    readonly innerRef: RefCallback;

    readonly values: ReadonlyArray<V>;

    readonly children: JSX.Element;

}

export type BlockComponent<V extends ListValue> = React.FunctionComponent<BlockComponentProps<V>>;

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

    readonly blockComponent: BlockComponent<V>;

    readonly visibleComponent: VisibleComponent<V>;

    readonly hiddenComponent: HiddenComponent<V>;

    readonly batchSize?: number;

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

    const batchSize = props.batchSize || 25;

    const blocks = Arrays.createBatches(props.values, batchSize);

    return (
        <>

            {blocks.map((block, idx) => (
                <IntersectionListBlock key={idx}
                                       root={props.root}
                                       values={block}
                                       blockComponent={props.blockComponent}
                                       visibleComponent={props.visibleComponent}
                                       hiddenComponent={props.hiddenComponent}/>

            ))}

        </>
    );

};