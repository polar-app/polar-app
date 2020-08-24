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
import {Arrays} from "polar-shared/src/util/Arrays";
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

function computePagemarkCoverageFromResize(rect: ILTRect,
                                           browserContext: IBrowserContext,
                                           pagemark: IPagemark): IPagemarkCoverage {

    function computeRange(): Range | undefined {

        const doc = browserContext.document;

        const elements = Array.from(doc.querySelectorAll("*")) as HTMLElement[];

        function predicate(element: HTMLElement): boolean {

            if (element.textContent === null || element.textContent.trim() === '') {
                return false;
            }

            return (element.offsetTop + element.offsetHeight) < (rect.top + rect.height);
        }

        const last = Arrays.last(elements.filter(predicate));

        if (! last) {
            return undefined;
        }

        const range = doc.createRange();

        range.setStart(last, 0);
        range.setEnd(last.firstChild!, last.textContent!.length - 1);

        return range;

    }

    const range = computeRange();

    // not needed for EPUB.
    const pagemarkRect = new PagemarkRect({left: 0, top: 0, width: 0, height: 0});
    const percentage = Percentages.calculate(rect.top + rect.height,
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

        if (! cfi) {
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

    function computeTopFromRange(): number | undefined {

        const cfi = pagemark.range?.start?.value
        const bcr = computeBoundingClientRectFromCFI(cfi);

        if (! bcr) {
            return undefined;
        }

        return bcr.top - browserContext.window.scrollY;

    }

    function computeHeightFromRange(): number | undefined {

        const cfi = pagemark.range?.end?.value
        const bcr = computeBoundingClientRectFromCFI(cfi);

        if (! bcr) {
            return undefined;
        }

        return bcr.bottom + browserContext.window.scrollY;

    }

    function computeInitialPosition(): ILTRect {

        const doc = browserContext.document;
        const body = doc.body;


        const left = 0;
        const width = body.offsetWidth;

        const top = computeTopFromRange() || 0;
        const height = computeHeightFromRange() || body.offsetHeight;

        return {top, left, width, height};

    }

    const handleResized = React.useCallback((rect: ILTRect) => {
        const pagemarkCoverage = computePagemarkCoverageFromResize(rect, browserContext, pagemark);

        const mutation: IPagemarkUpdate = {
            type: 'update',
            pageNum,
            existing: pagemark,
            ...pagemarkCoverage
        }

        onPagemark(mutation);

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
                computeInitialPosition={computeInitialPosition}
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
