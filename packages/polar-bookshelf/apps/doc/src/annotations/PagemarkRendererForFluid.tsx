import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import * as ReactDOM from "react-dom";
import {ResizeBox} from "./ResizeBox";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {isPresent} from "polar-shared/src/Preconditions";
import {PagemarkColors} from "polar-shared/src/metadata/PagemarkColors";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {PagemarkMenu, PagemarkValueContext} from "./PagemarkMenu";
import {
    createContextMenu,
    useContextMenu
} from "../../../repository/js/doc_repo/MUIContextMenu";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {EpubCFI} from 'epubjs';
import {PagemarkRect} from "../../../../web/js/metadata/PagemarkRect";
import {
    IPagemarkCoverage,
    IPagemarkUpdate,
    useDocViewerCallbacks
} from "../DocViewerStore";
import {Percentages} from "polar-shared/src/util/Percentages";
import {
    useWindowResizeEventListener,
    useWindowScrollEventListener
} from "../../../../web/js/react/WindowHooks";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Direction} from "../FluidPagemarkFactory";
import {
    FluidElementPredicates,
    RangeRects
} from "./pagemarks/FluidElementPredicates";

function computePagemarkCoverageFromResize(box: ILTRect,
                                           browserContext: IBrowserContext,
                                           pagemark: IPagemark,
                                           direction: Direction): IPagemarkCoverage {

    const boxRect = RangeRects.fromRect(box);

    function computeRange(): Range | undefined {

        const doc = browserContext.document;

        const elements = Array.from(doc.querySelectorAll("*")) as HTMLElement[];

        function textElementPredicate(element: HTMLElement): boolean {
            return element.textContent !== null && element.textContent.trim() !== '';
        }

        const predicate = FluidElementPredicates.create<HTMLElement>(direction, boxRect);

        const filtered = elements.filter(textElementPredicate)
                                 .filter(predicate.filter);

        const selected = predicate.select(filtered);

        if (! selected.target) {
            return undefined;
        }

        // TODO: I can't figure out how to reliably handle the computation of
        // range as epub seems to be finicky about computing it when I'm
        // updating the pagemarks and won't mount them properly when the pagemark
        // finally reloads. It also doesn't have a way to include/exclude images

        //
        // TODO: also, just computing the length of the textContent is wrong too
        // because it might be a mixed-node element with multiple children.

        // range.setStartBefore(selected);
        // range.setEndAfter(selected);

        // TODO: lastChild is working BUT it goes too far for the last item.

        function createRangeFromTarget() {

            const range = doc.createRange();

            switch (selected.target?.edge) {

                case "top":
                    range.setStart(selected.target.value, 0);
                    range.setEnd(selected.target.value, 0);
                    break;
                case "bottom":
                    range.setStart(selected.target.value, 0);
                    range.setEnd(selected.target.value.lastChild!, selected.target.value.lastChild?.nodeValue?.length || 0);
                    break;

            }

            return range;

        }

        return createRangeFromTarget();

    }

    const range = computeRange();

    // not needed for EPUB.
    const pagemarkRect = new PagemarkRect({left: 0, top: 0, width: 0, height: 0});
    const percentage = Percentages.calculate(box.height,
                                             browserContext.document.body.offsetHeight);

    return {percentage, rect: pagemarkRect, range};
}

function useEPUBIFrameElement(): HTMLIFrameElement {
    const docViewerElementsContext = useDocViewerElementsContext();
    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    return docViewerElement.querySelector('iframe')!;
}

interface IBrowserContext {
    readonly document: Document;
    readonly window: Window;
}

function useEPUBIFrameBrowserContext(): IBrowserContext{

    // TODO: there's a race here if the iframe isn't ready and also we should
    // use Iframes to listen to the contentDocument being set.

    const iframe = useEPUBIFrameElement();
    const document = iframe.contentDocument!;
    const window = document.defaultView!;
    return {document, window};

}

interface PagemarkInnerProps {
    readonly id: string;
    readonly iter?: number;
    readonly className: string;
    readonly fingerprint: string;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly pagemarkColor: PagemarkColors.PagemarkColor;

}

const PagemarkInner = deepMemo(function PagemarkInner(props: PagemarkInnerProps) {

    const {id, fingerprint, pagemark, pageNum, className, pagemarkColor} = props;

    const contextMenu = useContextMenu();
    const iframe = useEPUBIFrameElement();
    const browserContext = useEPUBIFrameBrowserContext();
    const {onPagemark} = useDocViewerCallbacks();

    const computeBoundingClientRectFromCFI = React.useCallback((cfi: string | undefined): DOMRect | undefined => {

        if (cfi === undefined) {
            return undefined;
        }

        try {
            const epubCFI = new EpubCFI(cfi);

            const range = epubCFI.toRange(browserContext.document);

            if (! range) {
                console.log("No range found for pagemark with CFI: " + cfi);
                return undefined;
            }

            return range.getBoundingClientRect();

        } catch (e) {
            console.warn("Unable to render pagemark: ", e);
            return undefined;
        }
    }, [browserContext]);

    const computeTopFromRange = React.useCallback((pagemark: IPagemark): number | undefined => {

        const cfi = pagemark.range?.start?.value

        const bcr = computeBoundingClientRectFromCFI(cfi);

        if (! bcr) {
            return undefined;
        }

        const scrollTop = browserContext.document.documentElement.scrollTop;
        return bcr.top + scrollTop;

    }, [browserContext, computeBoundingClientRectFromCFI]);

    const computeHeightFromRange = React.useCallback((pagemark: IPagemark, top: number): number | undefined => {

        const cfi = pagemark.range?.end?.value
        const bcr = computeBoundingClientRectFromCFI(cfi);

        if (! bcr) {
            return undefined;
        }

        const scrollTop = browserContext.document.documentElement.scrollTop;
        return bcr.bottom + scrollTop - top;

    }, [browserContext, computeBoundingClientRectFromCFI]);

    const computePositionUsingPagemark = React.useCallback((pagemark: IPagemark): ILTRect => {

        const doc = browserContext.document;
        const body = doc.body;

        const left = 0;
        const width = body.offsetWidth;

        // TODO: these returning 'undefined' I think is wrong because it
        // actually means they weren't found.
        const top = computeTopFromRange(pagemark) || 0;
        const height = computeHeightFromRange(pagemark, top) || body.offsetHeight;

        return {top, left, width, height};

    }, [browserContext, computeHeightFromRange, computeTopFromRange]);

    const handleResized = React.useCallback((rect: ILTRect, direction: Direction) => {

        const pagemarkCoverage = computePagemarkCoverageFromResize(rect, browserContext, pagemark, direction);

        const mutation: IPagemarkUpdate = {
            type: 'update',
            pageNum,
            existing: pagemark,
            ...pagemarkCoverage,
            direction
        }

        const updated = onPagemark(mutation);

        if (updated.length === 1) {
            // recompute the position and return the new box.
            const rect = computePositionUsingPagemark(updated[0].pagemark);
            return {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            }
        }

        return undefined;

    }, [browserContext, computePositionUsingPagemark, onPagemark, pageNum, pagemark]);

    if (! iframe || ! iframe.contentDocument) {
        // the iframe isn't mounted yet.
        return null;
    }

    return (
        <ResizeBox
                {...contextMenu}
                {...browserContext}
                onResized={handleResized}
                id={id}
                key={props.iter}
                iter={props.iter}
                bounds="parent"
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
                computePosition={() => computePositionUsingPagemark(pagemark)}
                resizeAxis='y'
                // enablePositionHack={true}
                resizeHandleStyle={{
                    ...pagemarkColor,
                    mixBlendMode: 'multiply',
                }}
                style={{
                    position: 'absolute',
                    zIndex: 9
                }}/>
    );
});

export const ContextMenu = createContextMenu(PagemarkMenu);

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly container: HTMLElement;
}

export const PagemarkRendererForFluid = deepMemo(function PagemarkRendererForFluid(props: IProps) {

    const {pagemark, fingerprint, pageNum, container} = props;

    const [iter, setIter] = React.useState(0);

    const win = React.useMemo(() => container.ownerDocument.defaultView || undefined, [container]);

    useWindowScrollEventListener('PagemarkRendererForFluid-scroll', NULL_FUNCTION);
    useWindowResizeEventListener('PagemarkRendererForFluid-resize', () => setIter(iter + 1), {win});

    const createID = React.useCallback(() => {
        return `${pagemark.id}`;
    }, [pagemark.id]);

    const toReactPortal = React.useCallback((container: HTMLElement) => {

        const id = createID();

        const className = `pagemark annotation polar-ui`;

        const pagemarkColor = PagemarkColors.toPagemarkColor(pagemark);

        return ReactDOM.createPortal(
            <PagemarkValueContext.Provider value={pagemark}>
                <ContextMenu>
                    <PagemarkInner id={id}
                                   iter={iter}
                                   key={iter}
                                   className={className}
                                   fingerprint={fingerprint}
                                   pageNum={pageNum}
                                   pagemark={pagemark}
                                   pagemarkColor={pagemarkColor}/>
                </ContextMenu>
            </PagemarkValueContext.Provider>,
            container);

    }, [createID, fingerprint, iter, pageNum, pagemark]);


    if (! container) {
        return null;
    }

    if (! isPresent(pagemark.percentage)) {
        throw new Error("Pagemark has no percentage");
    }

    return toReactPortal(container);

});
