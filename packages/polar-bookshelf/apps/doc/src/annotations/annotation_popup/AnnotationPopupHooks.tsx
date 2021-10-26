import React from "react";
import {DOMTextIndex} from "polar-dom-text-search/src/DOMTextIndex";
import {IDocScale, useDocViewerStore} from "../../DocViewerStore";
import {IDocViewerElements, useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {TextHighlightMerger} from "../../text_highlighter/TextHighlightMerger";
import {Point} from "polar-shared/src/util/Point";
import {Highlights} from "../../../../../web/js/dom_highlighter/Highlights";
import {ActiveSelectionEvent} from "../../../../../web/js/ui/popup/ActiveSelections";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {Elements} from "../../../../../web/js/util/Elements";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {useDOMTextIndexContext} from "../DOMTextIndexContext";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {Texts} from "polar-shared/src/metadata/Texts";
import {rangeConstrain} from "../AreaHighlightDrawer";
import {useResizeObserver} from "../../renderers/pdf/PinchToZoomHooks";
import {IBlockAnnotation, IDocMetaAnnotation} from "./AnnotationPopupReducer";
import {getAnnotationData} from "./AnnotationPopupContext";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";

export type ActiveHighlightData = {
    highlightID: string,
    type: (IDocMetaAnnotation | IBlockAnnotation)['type'],
    pageNum: number,
};

namespace AnnotationPositionCalculator {
    export function getAnnotationEPUBPosition(
        annotation: IDocMetaAnnotation | IBlockAnnotation,
        domTextIndex: DOMTextIndex,
        docViewerElements: IDocViewerElements,
    ): ILTRect | undefined {
        const {annotation: annotationObject} = getAnnotationData(annotation);
        const textHighlight = annotationObject as ITextHighlight;
        const epubDocument = docViewerElements
            .getDocViewerElement()
            .querySelector("iframe")
            ?.contentDocument
            ?.documentElement;
        const html = docViewerElements
            .getDocViewerElement()
            .querySelector("iframe")
            ?.contentDocument
            ?.defaultView;
        if (
            textHighlight.text &&
            epubDocument &&
            html
        ) {
            const hit = domTextIndex.find(Texts.toText(textHighlight.text) || "", {caseInsensitive: true});
            if (hit) {
                const positions = Highlights
                    .toHighlightViewportPositions(hit.regions)
                    .map(({ top, left, width, height }) => ({
                        top, left, width, height,
                        bottom: top + height,
                        right: left + width,
                    }));
                if (positions.length) {
                    const rect = Object.values(positions).reduce(TextHighlightMerger.mergeRects);
                    const point: Point = {
                        x: rect.left,
                        y: rect.top + html.scrollY,
                    };
                    return {
                        left: point.x,
                        top: point.y,
                        width: rect.width,
                        height: rect.height,
                    };
                }
            }
        }
        return undefined;
    }

    export function getSelectionEPUBPosition(
        selectionEvent: ActiveSelectionEvent,
        docViewerElements: IDocViewerElements,
    ): ILTRect | undefined {
        const docViewerElem = docViewerElements.getDocViewerElement();
        const pageElem = docViewerElem.querySelector<HTMLDivElement>('.page');

        const viewerElem = docViewerElem
            .querySelector<HTMLDivElement>("#viewer");
        const iframeWindow = docViewerElem
            .querySelector("iframe")
            ?.contentWindow;
        if (!viewerElem || !iframeWindow || !pageElem) {
            return;
        }

        const sRect = selectionEvent.boundingClientRect;
        const pageRect = pageElem.getBoundingClientRect();
        const viewerRect = viewerElem.getBoundingClientRect();

        return {
            top: sRect.top + pageRect.top - viewerRect.top + iframeWindow.scrollY,
            left: sRect.left + pageRect.left - viewerRect.left,
            width: sRect.width,
            height: sRect.height,
        };
    }

    export function getSelectionPDFPosition(
        selectionEvent: ActiveSelectionEvent,
        docViewerElements: IDocViewerElements,
    ): ILTRect | undefined {
        const pageElem = Elements.untilRoot(selectionEvent.element, ".page") as HTMLElement | undefined;
        const docViewerElem = docViewerElements.getDocViewerElement();
        const viewerElem = docViewerElem
            .querySelector<HTMLDivElement>("#viewer");
        const viewerContainer = docViewerElem
            .querySelector<HTMLDivElement>("#viewerContainer");
        if (!pageElem || !viewerElem || !docViewerElem || !viewerContainer) {
            return;
        }

        const sRect = selectionEvent.boundingClientRect;
        const viewerRect = viewerElem.getBoundingClientRect();

        return {
            left: sRect.left - viewerRect.left + viewerContainer.scrollLeft,
            top: sRect.top - viewerRect.top,
            width: sRect.width,
            height: sRect.height,
        };
    }

    export function getAnnotationPDFPosition(
        annotation: IDocMetaAnnotation | IBlockAnnotation,
        docViewerElements: IDocViewerElements,
        docScale: IDocScale
    ): ILTRect | undefined {
        const {pageNum, annotation: annotationObject} = getAnnotationData(annotation);
        const rects = Object.values((annotationObject as ITextHighlight).rects);
        const pageElem = docViewerElements.getPageElementForPage(pageNum);
        const docViewerElem = docViewerElements.getDocViewerElement();
        const viewerElem = docViewerElem
            .querySelector<HTMLDivElement>("#viewer");
        if (!pageElem || !viewerElem || !docViewerElem || !rects.length) {
            return;
        }
        const pageStyles = window.getComputedStyle(pageElem);
        const border = {
            top: +pageStyles.borderTopWidth.slice(0, -2),
            left: +pageStyles.borderLeftWidth.slice(0, -2),
            bottom: +pageStyles.borderBottomWidth.slice(0, -2),
            right: +pageStyles.borderRightWidth.slice(0, -2),
        };
        const pageRect = pageElem.getBoundingClientRect();
        const viewerRect = viewerElem.getBoundingClientRect();
        const rect = rects.reduce(TextHighlightMerger.mergeRects);
        const scale = docScale.scaleValue;

        return {
            left: rect.left * scale + pageRect.left - viewerRect.left + border.left,
            top: rect.top * scale + pageRect.top - viewerRect.top + border.top,
            width: rect.width * scale,
            height: rect.height * scale,
        };
    }
}

type IUsePopupBarPositionOpts = {
    selectionEvent?: ActiveSelectionEvent;
    annotation?: IDocMetaAnnotation | IBlockAnnotation;
};
export const usePopupBarPosition = (opts: IUsePopupBarPositionOpts): ILTRect | undefined => {
    const {selectionEvent, annotation} = opts;
    const {docScale} = useDocViewerStore(["docScale"]);
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const {fileType} = useDocViewerContext();
    const textIndex = useDOMTextIndexContext();

    return React.useMemo(() => {
        if (selectionEvent) {
            if (fileType === "epub") {
                return AnnotationPositionCalculator.getSelectionEPUBPosition(
                    selectionEvent,
                    docViewerElementsRef.current,
                );
            } else if (fileType === "pdf") {
                return AnnotationPositionCalculator.getSelectionPDFPosition(
                    selectionEvent,
                    docViewerElementsRef.current
                );
            }
        } else if (annotation) {
            if (fileType === "epub" && textIndex && textIndex.index) {
                return AnnotationPositionCalculator.getAnnotationEPUBPosition(
                    annotation,
                    textIndex.index,
                    docViewerElementsRef.current,
                );
            } else if (fileType === "pdf" && docScale) {
                return AnnotationPositionCalculator.getAnnotationPDFPosition(
                    annotation,
                    docViewerElementsRef.current,
                    docScale,
                );
            }
        }
        return;
        // TODO: Prevent rerenders if the annotation rects haven't changed
    }, [fileType, annotation, selectionEvent, docScale, textIndex, docViewerElementsRef]);
};

const CONTAINER_SPACING = 10;
const constrainToContainer = (
    container: HTMLElement,
    scrollElem: HTMLElement | Window,
    popup: HTMLElement,
    rect: ILTRect
): { rect: ILTRect, isTop: boolean } => {
    const containerRect = container.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const scrollY = isWindow(scrollElem) ? scrollElem.scrollY : scrollElem.scrollTop;
    const scrollX = isWindow(scrollElem) ? scrollElem.scrollX : scrollElem.scrollLeft;
    const isTop = rect.top + (rect.height / 2) - scrollY >= containerRect.height / 2;

    const obj = {
        isTop,
        rect: {
            ...rect,
            top: (isTop
                ? Math.round(rect.top - popupRect.height) - CONTAINER_SPACING
                : rect.top + rect.height) - scrollY + CONTAINER_SPACING,
            left: rangeConstrain(
                Math.round(rect.left + rect.width / 2 - popupRect.width / 2),
                CONTAINER_SPACING,
                containerRect.width - CONTAINER_SPACING - popupRect.width + scrollX - 10,
            ),
        },
    };
    return obj;
};

type IUseAnnotationPopupPositionUpdaterProps = {
    boundsElement: HTMLElement | null;
    scrollElement: HTMLElement | Window | null;
    rect: ILTRect;
    noScroll?: boolean;
};

const isWindow = (x: any): x is Window => {
    return x.window === x;
};

export const useAnnotationPopupPositionUpdater = (
    opts: IUseAnnotationPopupPositionUpdaterProps
): React.RefObject<HTMLDivElement> => {
    const {boundsElement, scrollElement, rect, noScroll = false} = opts;
    const ref = React.useRef<HTMLDivElement>(null);
    const updatePosition = React.useCallback(() => {
        const popupElem = ref.current;
        if (!popupElem || !boundsElement || !scrollElement) {
            return;
        }

        const scrollY = isWindow(scrollElement) ? scrollElement.scrollY : scrollElement.scrollTop;
        const {rect: {left, top}, isTop} = constrainToContainer(boundsElement, scrollElement, popupElem, rect);
        popupElem.style.transform = `translate3d(calc(${left}px), calc(${top + (noScroll ? scrollY : 0)}px), 0)`;
        popupElem.classList[isTop ? "remove" : "add"]("flipped");
    }, [rect, boundsElement, scrollElement, ref, noScroll]);

    React.useEffect(() => {
        const popupElem = ref.current;
        if (!popupElem || !boundsElement || !scrollElement) {
            return;
        }
        updatePosition();
        const onScroll = () => updatePosition();
        scrollElement.addEventListener("scroll", onScroll, {passive: true});
        return () => scrollElement.removeEventListener("scroll", onScroll);
    }, [boundsElement, scrollElement, updatePosition, ref]);

    useResizeObserver(updatePosition, {current: boundsElement || null});
    useResizeObserver(updatePosition, ref);

    return ref;
};
