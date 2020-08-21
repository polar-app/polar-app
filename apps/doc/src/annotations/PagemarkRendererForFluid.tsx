import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import * as ReactDOM from "react-dom";
import {ResizeBox} from "./ResizeBox";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {isPresent} from "polar-shared/src/Preconditions";
import {PagemarkColors} from "polar-shared/src/metadata/PagemarkColors";
import isEqual from "react-fast-compare";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {PagemarkMenu, PagemarkValueContext} from "./PagemarkMenu";
import {
    createContextMenu,
    useContextMenu
} from "../../../repository/js/doc_repo/MUIContextMenu";
import {useDocViewerCallbacks} from "../DocViewerStore";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {EpubCFI} from 'epubjs';
import {useEPUBIFrameContext} from "../renderers/epub/contextmenu/EPUBIFrameContext";

interface PagemarkInnerProps {
    readonly id: string;
    readonly className: string;
    readonly fingerprint: string;
    readonly pageNum: number;
    readonly pagemark: IPagemark;
    readonly pagemarkColor: PagemarkColors.PagemarkColor;

}

function useEPUBIFrameElement(): HTMLIFrameElement {
    const docViewerElementsContext = useDocViewerElementsContext();
    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    return docViewerElement.querySelector('iframe')!;
}

const PagemarkInner = deepMemo((props: PagemarkInnerProps) => {

    const {id, fingerprint, pagemark, pageNum, className, pagemarkColor} = props;

    const contextMenu = useContextMenu();

    const callbacks = useDocViewerCallbacks();
    const iframe = useEPUBIFrameElement();

    if (! iframe || ! iframe.contentDocument) {
        // the iframe isn't mounted yet.
        console.log("FIXME: no iframe yet");
        return null;
    }

    function computeHeightFromRange() {

        const cfi = pagemark.range?.end?.value

        if (! cfi) {
            return undefined;
        }

        console.log("FIXME: finding cfi: ", cfi);

        // FIXME: we need a base here...
        const epubCFI = new EpubCFI(cfi);
        const range = epubCFI.toRange(iframe.contentDocument!);

        if (! range) {
            console.log("No range found for pagemark with CFI: " + cfi);
            return;
        }

        const bcr = range.getBoundingClientRect();
        return bcr.bottom;
    }

    const top = 0;
    const left = 0;
    const width = iframe.contentDocument!.body.offsetWidth;
    const height = computeHeightFromRange() || iframe.contentDocument!.body.offsetHeight;

    console.log("FIXME: using pagemark dimensions: ", {top, left, width, height});

    const handleResized = React.useCallback((rect: ILTRect) => {

        // FIXME this doesn't work just yet and we need a way to handle it properly
        // because we need to figure out where the pagemarks are being placed
        // based on the epubcfi...

        //
        // const pageElement = docViewerElementsContext.getPageElementForPage(pageNum)!;
        // const newPagemark = computePagemarkFromResize(rect, pageElement, pagemark);
        //
        // const mutation: IPagemarkUpdate = {
        //     type: 'update',
        //     pageNum,
        //     pagemark: newPagemark
        // }
        //
        // callbacks.onPagemark(mutation);

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
                data-page-num={pageNum}
                // annotation descriptor metadata - might not be needed anymore
                data-annotation-type="pagemark"
                data-annotation-page-num={pageNum}
                data-annotation-doc-fingerprint={fingerprint}
                className={className}
                left={left}
                top={top}
                width={width}
                height={height}
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
