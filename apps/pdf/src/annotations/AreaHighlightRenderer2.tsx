import * as React from "react";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {computePageDimensions, useAnnotationContainer} from "./AnnotationHooks";
import {AreaHighlightRects} from "../../../../web/js/metadata/AreaHighlightRects";
import * as ReactDOM from "react-dom";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {AreaHighlightRect} from "../../../../web/js/metadata/AreaHighlightRect";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {ResizeBox} from "./ResizeBox";
import isEqual from "react-fast-compare";
import {useDocViewerStore} from "../DocViewerStore";

interface IProps {
    readonly fingerprint: IDStr;
    readonly page: number;
    readonly areaHighlight: IAreaHighlight;
}

export const AreaHighlightRenderer2 = React.memo((props: IProps) => {

    const {areaHighlight, fingerprint, page} = props;
    const container = useAnnotationContainer(page);
    const {docScale} = useDocViewerStore();

    if (! container) {
        return null;
    }

    if (! docScale) {
        return null;
    }

    const {scaleValue} = docScale;

    const pageDimensions = computePageDimensions(page);

    const toOverlayRect = (areaHighlightRect: AreaHighlightRect): ILTRect => {

        if (areaHighlight.position) {

            const overlayRect = {
                left: areaHighlight.position.x,
                top: areaHighlight.position.y,
                width: areaHighlight.position.width,
                height: areaHighlight.position.height
            };

            return Rects.scale(Rects.createFromBasicRect(overlayRect), scaleValue);

        }

        // This is for OLDER area highlights but these will be deprecated
        // pretty soon as they're not really used very much I imagine.

        return areaHighlightRect.toDimensions(pageDimensions);

    };

    const handleResize = (overlayRect: ILTRect) => {

    }

    const createID = () => {
        return `area-highlight-${areaHighlight.id}`;
    };

    const toReactPortal = (rect: IRect, container: HTMLElement) => {

        const areaHighlightRect = AreaHighlightRects.createFromRect(rect);
        const overlayRect = toOverlayRect(areaHighlightRect);

        const id = createID();

        const className = `area-highlight annotation area-highlight-${areaHighlight.id}`;

        const color: HighlightColor = areaHighlight.color || 'yellow';
        const backgroundColor = HighlightColors.toBackgroundColor(color, 0.5);

        return ReactDOM.createPortal(
            <ResizeBox
                 id={id}
                 data-type="area-highlight"
                 data-doc-fingerprint={fingerprint}
                 data-area-highlight-id={areaHighlight.id}
                 data-annotation-id={areaHighlight.id}
                 data-page-num={page}
                // annotation descriptor metadata - might not be needed
                // anymore
                 data-annotation-type="area-highlight"
                 data-annotation-page-num={page}
                 data-annotation-doc-fingerprint={fingerprint}
                 data-annotation-color={color}
                 className={className}
                 left={overlayRect.left}
                 top={overlayRect.top}
                 width={overlayRect.width}
                 height={overlayRect.height}
                 style={{
                     position: 'absolute',
                     backgroundColor,
                     mixBlendMode: 'multiply',
                     border: `1px solid #c6c6c6`,
                     zIndex: 1
                 }}
                 onResized={handleResize}
                 />,
            container);
    };
    const portals = Object.values(areaHighlight.rects)
        .map(current => toReactPortal(current, container));

    return (
        <>
            {portals}
        </>
    );


}, isEqual);
