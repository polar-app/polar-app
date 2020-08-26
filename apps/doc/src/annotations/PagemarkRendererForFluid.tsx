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

        if (! selected) {
            return undefined;
        }

        const range = doc.createRange();

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

        range.setStart(selected, 0);
        range.setEnd(selected.lastChild!, selected.lastChild?.nodeValue?.length || 0);

        return range;

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
    const iframe = useEPUBIFrameElement();
    const document = iframe.contentDocument!;
    const window = document.defaultView!;
    return {document, window};
}

interface PagemarkInnerProps {
    readonly id: string;
    readonly className: string;
    readonly fingerprint: string;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly pagemarkColor: PagemarkColors.PagemarkColor;

}

const PagemarkInner = deepMemo((props: PagemarkInnerProps) => {

    const {id, fingerprint, pagemark, pageNum, className, pagemarkColor} = props;

    const contextMenu = useContextMenu();
    const iframe = useEPUBIFrameElement();
    const browserContext = useEPUBIFrameBrowserContext();
    const {onPagemark} = useDocViewerCallbacks();

    if (! iframe || ! iframe.contentDocument) {
        // the iframe isn't mounted yet.
        return null;
    }

    function computeBoundingClientRectFromCFI(cfi: string | undefined): DOMRect | undefined {

        if (cfi === undefined) {
            return undefined;
        }

        const epubCFI = new EpubCFI(cfi);
        const range = epubCFI.toRange(browserContext.document);

        if (! range) {
            console.log("No range found for pagemark with CFI: " + cfi);
            return undefined;
        }

        return range.getBoundingClientRect();

    }

    function computeTopFromRange(pagemark: IPagemark): number | undefined {

        const cfi = pagemark.range?.start?.value

        const bcr = computeBoundingClientRectFromCFI(cfi);

        if (! bcr) {
            return undefined;
        }

        const scrollTop = browserContext.document.documentElement.scrollTop;
        return bcr.top + scrollTop;

    }

    function computeHeightFromRange(pagemark: IPagemark, top: number): number | undefined {

        const cfi = pagemark.range?.end?.value
        const bcr = computeBoundingClientRectFromCFI(cfi);

        if (! bcr) {
            return undefined;
        }
        const scrollTop = browserContext.document.documentElement.scrollTop;
        return bcr.bottom + scrollTop - top;

    }

    function computePositionUsingPagemark(pagemark: IPagemark): ILTRect {

        const doc = browserContext.document;
        const body = doc.body;

        const left = 0;
        const width = body.offsetWidth;

        const top = computeTopFromRange(pagemark) || 0;
        const height = computeHeightFromRange(pagemark, top) || body.offsetHeight;

        return {top, left, width, height};

    }

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

    }, []);

    return (
        <ResizeBox
                {...contextMenu}
                {...browserContext}
                onResized={handleResized}
                id={id}
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

export const PagemarkRendererForFluid = deepMemo((props: IProps) => {

    const {pagemark, fingerprint, pageNum, container} = props;
    useWindowScrollEventListener(NULL_FUNCTION);
    useWindowResizeEventListener(NULL_FUNCTION);

    if (! container) {
        return null;
    }

    if (! isPresent(pagemark.percentage)) {
        throw new Error("Pagemark has no percentage");
    }

    const createID = () => {
        return `primary-pagemark-${pagemark.id}`;
    };

    const toReactPortal = (container: HTMLElement) => {

        const id = createID();

        const className = `pagemark annotation polar-ui`;

        const pagemarkColor = PagemarkColors.toPagemarkColor(pagemark);

        return ReactDOM.createPortal(
            <PagemarkValueContext.Provider value={pagemark}>
                <ContextMenu>
                    <PagemarkInner id={id}
                                   className={className}
                                   fingerprint={fingerprint}
                                   pageNum={pageNum}
                                   pagemark={pagemark}
                                   pagemarkColor={pagemarkColor}/>
                </ContextMenu>
            </PagemarkValueContext.Provider>,
            container);
    };

    return toReactPortal(container);

});
