import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {
    AbstractAnnotationRenderer,
    AbstractAnnotationRendererProps,
    AbstractAnnotationRendererState, useAnnotationContainer
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
import isEqual from "react-fast-compare";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {PagemarkMenu, PagemarkValueContext} from "./PagemarkMenu";
import {
    createContextMenu,
    useContextMenu
} from "../../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import {AnnotationRects} from "../../../../web/js/metadata/AnnotationRects";
import {IDimensions} from "polar-shared/src/util/IDimensions";

interface IProps extends AbstractAnnotationRendererProps {
    readonly fingerprint: IDStr;
    readonly pagemark: IPagemark;
    readonly scaleValue: number | undefined;
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

function toOverlayRect(placementRect: Rect, pagemark: Pagemark | IPagemark) {

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

}

function computePagemarkFromResize(rect: ILTRect,
                                   page: number,
                                   pagemark: IPagemark) {

    function computePageDimensions(page: number): IDimensions {
        // TODO this is a bit of a hack.
        const pageElement = document.querySelectorAll(".page")[page - 1];
        return {
            width: pageElement.clientWidth,
            height: pageElement.clientHeight
        }
    }

    const pageDimensions = computePageDimensions(page)

    const annotationRect = AnnotationRects.createFromPositionedRect(Rects.createFromBasicRect(rect),
                                                                    pageDimensions);

    const pagemarkRect = new PagemarkRect(annotationRect);

    const newPagemark = Object.assign({}, pagemark);
    return newPagemark;

}

interface PagemarkInnerProps {
    readonly id: string;
    readonly className: string;
    readonly fingerprint: string;
    readonly page: number;
    readonly pagemark: IPagemark;
    readonly overlayRect: ILTRect;
    readonly pagemarkColor: PagemarkColors.PagemarkColor;

}

const PagemarkInner = React.memo((props: PagemarkInnerProps) => {

    const {id, fingerprint, pagemark, page, className, overlayRect, pagemarkColor} = props;

    const contextMenu = useContextMenu();

    const handleResized = React.useCallback((rect: ILTRect) => {
        const newPagemark = computePagemarkFromResize(rect, page, pagemark);
        // console.log("FIXME: resized: ", rect, newPagemark);
    }, []);

    return (
        <ResizeBox
                {...contextMenu}
                onResized={handleResized}
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
                }}/>
    );
}, isEqual);

export const ContextMenu = createContextMenu(PagemarkMenu);

export const PagemarkRenderer2 = React.memo((props: IProps) => {

    const {pagemark, scaleValue, fingerprint, page} = props;

    const container = useAnnotationContainer(page);

    if (! container) {
        return null;
    }

    if (! scaleValue) {
        return null;
    }

    if (! isPresent(pagemark.percentage)) {
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
            <PagemarkValueContext.Provider value={pagemark}>
                <ContextMenu>
                    <PagemarkInner id={id}
                                   className={className}
                                   fingerprint={fingerprint}
                                   page={page}
                                   pagemark={pagemark}
                                   overlayRect={overlayRect}
                                   pagemarkColor={pagemarkColor}/>
                </ContextMenu>
            </PagemarkValueContext.Provider>,
            container);
    };

    return toReactPortal(container);

}, isEqual);
