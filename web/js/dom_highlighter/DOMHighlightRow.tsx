import React from 'react';
import {deepMemo, memoForwardRef} from "../react/ReactUtils";
import {Highlights} from "./Highlights";
import intersectsWithWindow = Highlights.intersectsWithWindow;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;
import {useScrollIntoViewUsingLocation} from "../../../apps/doc/src/annotations/ScrollIntoViewUsingLocation";

interface IProps extends IHighlightViewportPosition {
    readonly id: string;
    readonly color?: string;
}

/**
 * Handles rendering a single row of non-overflow text.
 */
export const DOMHighlightRow = deepMemo((props: IProps) => {

    const scrollIntoViewRef = useScrollIntoViewUsingLocation();

    const useMinimalUI = ! intersectsWithWindow(props);

    // we use the absolute position so that on scroll nothing is actually updated
    const absolutePosition = Highlights.fixedToAbsolute(props);

    const backgroundColor = props.color || 'rgba(255, 255, 0, 0.5)';

    if (useMinimalUI) {

        return (
            <div id={props.id}
                 ref={scrollIntoViewRef}
                 style={{
                     position: 'absolute',
                     ...absolutePosition
                 }}>
            </div>
        );

    } else {
        return (
            <div id={props.id}
                 ref={scrollIntoViewRef}
                 className="polar-ui"
                 style={{
                     backgroundColor: `${backgroundColor}`,
                     position: 'absolute',
                     pointerEvents: 'none',
                     mixBlendMode: 'overlay',
                     ...absolutePosition
                 }}>
            </div>
        );

    }

});
