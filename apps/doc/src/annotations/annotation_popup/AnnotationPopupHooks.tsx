import React from "react";
import {DOMTextIndex} from "polar-dom-text-search/src/DOMTextIndex";
import {AnnotationTypes} from "../../../../../web/js/metadata/AnnotationTypes";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {IDocScale, useDocViewerStore} from "../../DocViewerStore";
import {IDocViewerElements, useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {TextHighlightMerger} from "../../text_highlighter/TextHighlightMerger";
import {Point} from "../../../../../web/js/Point";
import {Highlights} from "../../../../../web/js/dom_highlighter/Highlights";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {ActiveSelectionEvent} from "../../../../../web/js/ui/popup/ActiveSelections";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {Elements} from "../../../../../web/js/util/Elements";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {useDOMTextIndexContext} from "../DOMTextIndexContext";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";

export type ActiveHighlightData = {
    highlightID: string;
    type: AnnotationType.TEXT_HIGHLIGHT | AnnotationType.AREA_HIGHLIGHT;
    pageNum: number;
};

namespace AnnotationPositionCalculator {
    export function getAnnotationEPUBPosition(
        annotation: IDocAnnotation,
        domTextIndex: DOMTextIndex,
        docViewerElements: IDocViewerElements,
    ): ILTRect | undefined {
        const annotationObject = annotation.original;
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
            AnnotationTypes.isTextHighlight(annotationObject, annotation.annotationType) &&
            annotation.text &&
            epubDocument &&
            html
        ) {
            const hit = domTextIndex.find(annotation.text, {caseInsensitive: true});
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
        if (!pageElem || !viewerElem || !docViewerElem) {
            return;
        }

        const sRect = selectionEvent.boundingClientRect;
        const viewerRect = viewerElem.getBoundingClientRect();

        return {
            left: sRect.left - viewerRect.left,
            top: sRect.top - viewerRect.top,
            width: sRect.width,
            height: sRect.height,
        };
    }

    export function getAnnotationPDFPosition(
        annotation: IDocAnnotation,
        docViewerElements: IDocViewerElements,
        docScale: IDocScale
    ): ILTRect | undefined {
        const annotationObject = annotation.original;
        if (
            AnnotationTypes.isTextHighlight(annotationObject, annotation.annotationType)
        ) {
            const pageElem = docViewerElements.getPageElementForPage(annotation.pageNum);
            const docViewerElem = docViewerElements.getDocViewerElement();
            const viewerElem = docViewerElem
                .querySelector<HTMLDivElement>("#viewer");
            const rects = Object.values(annotationObject.rects);
            if (!pageElem || !viewerElem || !docViewerElem || !rects.length) {
                return;
            }
            const pageRect = pageElem.getBoundingClientRect();
            const viewerRect = viewerElem.getBoundingClientRect();
            const rect = rects.reduce(TextHighlightMerger.mergeRects);
            const scale = docScale.scaleValue;

            return {
                left: rect.left * scale + pageRect.left - viewerRect.left, 
                top: rect.top * scale + pageRect.top - viewerRect.top,
                width: rect.width * scale,
                height: rect.height * scale,
            };
        }
        return;
    }
}

type IUsePopupBarPositionOpts = {
    selectionEvent?: ActiveSelectionEvent;
    annotation?: IDocAnnotation;
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
        // TODO: Prevent rerenders if the annotation rects hasn't changed
    }, [fileType, annotation, selectionEvent, docScale, textIndex, docViewerElementsRef]);
};
