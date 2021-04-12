import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {computePageDimensions} from "./AnnotationHooks";
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
} from "../../../repository/js/doc_repo/MUIContextMenu";
import {AnnotationRects} from "../../../../web/js/metadata/AnnotationRects";
import {
    IPagemarkCoverage,
    IPagemarkUpdate,
    useDocViewerCallbacks
} from "../DocViewerStore";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

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

function computePagemarkCoverageFromResize(rect: ILTRect,
                                           pageElement: HTMLElement): IPagemarkCoverage {

    const pageDimensions = computePageDimensions(pageElement)

    const annotationRect = AnnotationRects.createFromPositionedRect(Rects.createFromBasicRect(rect),
                                                                    pageDimensions);

    const pagemarkRect = new PagemarkRect(annotationRect);

    const percentage = pagemarkRect.toPercentage();

    return {percentage, rect: pagemarkRect, range: undefined};

}

interface PagemarkInnerProps {
    readonly id: string;
    readonly className: string;
    readonly fingerprint: string;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly overlayRect: ILTRect;
    readonly pagemarkColor: PagemarkColors.PagemarkColor;

}

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly container: HTMLElement;
}

const PagemarkInner = React.memo(function PagemarkInner(props: PagemarkInnerProps) {

    const {id, fingerprint, pagemark, pageNum, className, overlayRect, pagemarkColor} = props;

    const contextMenu = useContextMenu();

    const {onPagemark} = useDocViewerCallbacks();
    const docViewerElementsContext = useDocViewerElementsContext();

    const handleResized = React.useCallback((rect: ILTRect, direction) => {

        const pageElement = docViewerElementsContext.getPageElementForPage(pageNum)!;
        const pagemarkCoverage = computePagemarkCoverageFromResize(rect, pageElement);

        const mutation: IPagemarkUpdate = {
            type: 'update',
            pageNum,
            existing: pagemark,
            ...pagemarkCoverage,
            direction
        }

        onPagemark(mutation);

        return undefined;

    }, [onPagemark, pageNum, pagemark, docViewerElementsContext]);

    return (
        <ResizeBox
                {...contextMenu}
                onResized={handleResized}
                id={id}
                data-type="pagemark"
                data-doc-fingerprint={fingerprint}
                data-pagemark-id={pagemark.id}
                data-annotation-id={pagemark.id}
                data-page-num={pageNum}
                // annotation descriptor metadata - might not be needed anymore
                data-annotation-type="pagemark"
                data-annotation-page-num={pageNum}
                data-annotation-doc-fingerprint={fingerprint}
                className={className}
                computePosition={() => overlayRect}
                resizeHandleStyle={{
                    ...pagemarkColor,
                    mixBlendMode: 'multiply',
                }}
                style={{
                    position: 'absolute',
                    zIndex: 9
                }}/>
    );
}, isEqual);

export const ContextMenu = createContextMenu(PagemarkMenu);

export const PagemarkRendererForFixed = deepMemo(function PagemarkRendererForFixed(props: IProps) {

    const {pagemark, fingerprint, pageNum, container} = props;

    const createID = React.useCallback(() => {
        return `${pagemark.id}`;
    }, [pagemark.id]);

    const toReactPortal = React.useCallback((container: HTMLElement) => {

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
                                   pageNum={pageNum}
                                   pagemark={pagemark}
                                   overlayRect={overlayRect}
                                   pagemarkColor={pagemarkColor}/>
                </ContextMenu>
            </PagemarkValueContext.Provider>,
            container);
    }, [createID, fingerprint, pageNum, pagemark]);

    if (! container) {
        return null;
    }

    if (! isPresent(pagemark.percentage)) {
        throw new Error("Pagemark has no percentage");
    }


    return toReactPortal(container);

});
