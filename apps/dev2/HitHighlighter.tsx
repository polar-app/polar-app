import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {
    useResizeEventListener,
    useScrollEventListener
} from "../../web/js/react/WindowHooks";

interface IPosition {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}

interface IHighlightNode {
    readonly start: number;
    readonly end: number;
    readonly node: Node;
}

interface IProps extends IHighlightNode {
}

function createPosition(highlight: IHighlightNode): IPosition {

    const range = document.createRange();
    range.setStart(highlight.node, highlight.start);
    range.setEnd(highlight.node, highlight.end);

    const rect = range.getBoundingClientRect();

    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };

}

export const HitHighlighter = memoForwardRef((props: IProps) => {

    const [position, setPosition] = React.useState<IPosition>(createPosition(props))

    const redrawCallback = React.useCallback(() => {
        setPosition(createPosition(props));
    }, []);

    useScrollEventListener(redrawCallback);
    useResizeEventListener(redrawCallback);

    return (
        <div style={{
                 backgroundColor: 'rgba(255, 255, 0, 0.5)',
                 position: 'fixed',
                 ...position
             }}>

        </div>
    )

});
