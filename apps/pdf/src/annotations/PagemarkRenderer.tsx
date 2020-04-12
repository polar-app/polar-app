import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {
    AbstractAnnotationRenderer,
    AbstractAnnotationRendererProps,
    AbstractAnnotationRendererState
} from "./AbstractAnnotationRenderer";
import * as ReactDOM from "react-dom";
import {ResizeBox} from "./ResizeBox";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {isPresent} from "polar-shared/src/Preconditions";
import {Rect} from "../../../../web/js/Rect";
import {Pagemark} from "../../../../web/js/metadata/Pagemark";
import {PagemarkRect} from "../../../../web/js/metadata/PagemarkRect";
import {Styles} from "../../../../web/js/util/Styles";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {PagemarkColors} from "polar-shared/src/metadata/PagemarkColors";

interface IProps extends AbstractAnnotationRendererProps {
    readonly fingerprint: IDStr;
    readonly pagemark: IPagemark;
    readonly scaleValue: number | undefined;
}

interface IState extends AbstractAnnotationRendererState {
    readonly container: HTMLElement | undefined;
}

const createPlacementRect = (placementElement: HTMLElement) => {

    const positioning = Styles.positioning(placementElement);
    const positioningPX = Styles.positioningToPX(positioning);

    // TODO: this could be cleaned up a bit...

    // TODO: the offsetWidth does not properly have the width applied to
    // it for some reason when scale is being used.  getBoundingClientRect
    // works though.

    const result = {
        left: Optional.of(positioningPX.left).getOrElse(placementElement.offsetLeft),
        top: Optional.of(positioningPX.top).getOrElse(placementElement.offsetTop),
        width: Optional.of(positioningPX.width).getOrElse(placementElement.offsetWidth),
        height: Optional.of(positioningPX.height).getOrElse(placementElement.offsetHeight),
    };

    return Rects.createFromBasicRect(result);

};

const toOverlayRect = (placementRect: Rect, pagemark: Pagemark | IPagemark) => {

    const pagemarkRect = new PagemarkRect(pagemark.rect);

    const overlayRect = pagemarkRect.toDimensions(placementRect.dimensions);

    // we have to apply the original placementRect top and left so it's
    // placed as a proper overlay
    return Rects.createFromBasicRect({
        left: overlayRect.left + placementRect.left,
        top: overlayRect.top + placementRect.top,
        width: overlayRect.width,
        height: overlayRect.height,
    });

};

export class PagemarkRenderer extends AbstractAnnotationRenderer<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            container: undefined
        };

    }

    public render() {

        const {container} = this.state;
        const {pagemark, scaleValue, fingerprint, page} = this.props;

        if (!container || !scaleValue) {
            return null;
        }

        if (!isPresent(pagemark.percentage)) {
            throw new Error("Pagemark has no percentage");
        }

        const createID = () => {
            return `primary-pagemark-${pagemark.id}`;
        };

        const toReactPortal = (container: HTMLElement) => {

            const placementRect = createPlacementRect(container);
            const overlayRect = toOverlayRect(placementRect, pagemark);

            const id = createID();

            const className = `pagemark annotation`;

            const pagemarkColor = PagemarkColors.toPagemarkColor(pagemark);

            return ReactDOM.createPortal(
                <ResizeBox
                    id={id}
                    data-type="pagemark"
                    data-doc-fingerprint={fingerprint}
                    data-pagemark-id={pagemark.id}
                    data-annotation-id={pagemark.id}
                    data-page-num={page}
                    // annotation descriptor metadata - might not be needed
                    // anymore
                    data-annotation-type="pagemark"
                    data-annotation-page-num={page}
                    data-annotation-doc-fingerprint={fingerprint}
                    className={className}
                    left={overlayRect.left}
                    top={overlayRect.top}
                    width={overlayRect.width}
                    height={overlayRect.height}
                    style={{
                        position: 'absolute',
                        ...pagemarkColor,
                        mixBlendMode: 'multiply',
                        zIndex: 9
                    }}/>,
                container);
        };

        return toReactPortal(container);

    }

}
