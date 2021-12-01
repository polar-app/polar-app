import React from "react";
import {Popper, PopperProps} from "@material-ui/core";
import {ContentEditables} from "../ContentEditables";
import {BLOCK_FORMAT_BAR_CONTAINER_ID} from "./NoteFormatBar";
import {Elements} from "../../util/Elements";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";

interface INoteFormatPopperPositionerProps {
    readonly elem: HTMLElement;
}

export const NoteFormatPopperPositioner: React.FC<INoteFormatPopperPositionerProps> = (props) => {
    const { children, elem } = props;

    const anchorEl: PopperProps['anchorEl'] = React.useMemo(() => {
        const range = ContentEditables.currentRange();

        if (! range) {
            return undefined;
        }

        const bcr = range.getBoundingClientRect();

        return {
            parentNode: elem,
            getBoundingClientRect: () => range.getBoundingClientRect(),
            clientWidth: bcr.width,
            clientHeight: bcr.height,
        };
    }, [elem]);

    const scrollParent = React.useMemo(() => Elements.getScrollParent(elem) || document.body, [elem]);

    return (
        <Popper open
                modifiers={{
                    preventOverflow: { enabled: true, boundariesElement: scrollParent },
                    hide: { enabled: true },
                }}
                container={scrollParent}
                anchorEl={anchorEl}
                id={BLOCK_FORMAT_BAR_CONTAINER_ID}
                children={children} />
    );
};


interface IFakeRangeRenderer {
    readonly elem: HTMLElement;
    readonly fakeRangeRect: ILTRect;
}

/**
 * TODO: This is not really necessary but it should be implemented in the future
 *
 */
export const FakeRangeRenderer: React.FC<IFakeRangeRenderer> = (props) => {
    const { elem, fakeRangeRect } = props;

    return null;
};
