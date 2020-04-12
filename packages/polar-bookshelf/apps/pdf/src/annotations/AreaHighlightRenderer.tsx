import * as React from "react";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {
    AbstractAnnotationRenderer,
    AbstractAnnotationRendererProps,
    AbstractAnnotationRendererState
} from "./AbstractAnnotationRenderer";
import {AreaHighlightRects} from "../../../../web/js/metadata/AreaHighlightRects";
import * as ReactDOM from "react-dom";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Logger} from "polar-shared/src/logger/Logger";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {AreaHighlightRect} from "../../../../web/js/metadata/AreaHighlightRect";
import {AreaHighlights} from "../../../../web/js/metadata/AreaHighlights";
import {IRect} from "polar-shared/src/util/rects/IRect";
import { ResizeBox } from "./ResizeBox";

const log = Logger.create();

interface IProps extends AbstractAnnotationRendererProps {
    readonly fingerprint: IDStr;
    readonly areaHighlight: IAreaHighlight;
    readonly scaleValue: number | undefined;
}

interface IState extends AbstractAnnotationRendererState {
    readonly container: HTMLElement | undefined;
}

export class AreaHighlightRenderer extends AbstractAnnotationRenderer<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            container: undefined
        };

    }

    public render() {

        const {container} = this.state;
        const {scaleValue} = this.props;

        if (! container || ! scaleValue) {
            return null;
        }

        const {areaHighlight, fingerprint, page} = this.props;

        const {pageDimensions} = AreaHighlights.computePageDimensions(page);

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
                     }}/>,
                container);
        };

        return Object.values(areaHighlight.rects)
            .map(current => toReactPortal(current, container));

    }

}
