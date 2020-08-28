import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {Highlights} from "./Highlights";
import {useScrollIntoViewUsingLocation} from "../../../apps/doc/src/annotations/ScrollIntoViewUsingLocation";
import intersectsWithWindow = Highlights.intersectsWithWindow;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

interface IProps extends IHighlightViewportPosition {
    readonly id: string;
    readonly color?: string;
    readonly className?: string;
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
                 className={props.className}
                 style={{
                     position: 'absolute',
                     ...absolutePosition
                 }}>
            </div>
        );

    } else {

        const dataAttributes = Dictionaries.dataAttributes(props);

        return (
            <div id={props.id}
                 ref={scrollIntoViewRef}
                 {...dataAttributes}
                 className={"polar-ui " + props.className || ''}
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
