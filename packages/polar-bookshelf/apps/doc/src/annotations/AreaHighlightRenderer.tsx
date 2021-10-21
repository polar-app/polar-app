import * as React from "react";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "polar-shared/src/util/Rects";
import {computePageDimensions} from "./AnnotationHooks";
import {AreaHighlightRects} from "../../../../web/js/metadata/AreaHighlightRects";
import * as ReactDOM from "react-dom";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {AreaHighlightRect} from "../../../../web/js/metadata/AreaHighlightRect";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {ResizeBox} from "./ResizeBox";
import {useDocViewerStore} from "../DocViewerStore";
import {useAreaHighlightHooks} from "./AreaHighlightHooks";
import {IDocMetas} from "polar-shared/src/metadata/IDocMetas";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {IBlockAreaHighlight} from "polar-blocks/src/annotations/IBlockAreaHighlight";
import {NEW_NOTES_ANNOTATION_BAR_ENABLED} from "../DocViewer";
import {useBlockAreaHighlight} from "../../../../web/js/notes/HighlightBlocksHooks";
import {useDocViewerContext} from "../renderers/DocRenderer";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly areaHighlight: IAreaHighlight | IBlockAreaHighlight;
    readonly container: HTMLElement;
    readonly id: string;
}

export const AreaHighlightRenderer = deepMemo(function AreaHighlightRenderer(props: IProps) {

    const {areaHighlight, fingerprint, pageNum, container, id} = props;
    const {docMeta, docScale} = useDocViewerStore(['docMeta', 'docScale']);
    const {onAreaHighlightUpdated} = useAreaHighlightHooks();
    const docViewerElementsContext = useDocViewerElementsContext();
    const {update: updateBlockAreaHighlight} = useBlockAreaHighlight();
    const {fileType} = useDocViewerContext();
    const docViewerElements = useDocViewerElementsContext();

    const pageElement = docViewerElementsContext.getPageElementForPage(pageNum);

    const [draggable, setDraggable] = React.useState(false);

    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
                setDraggable(true);
            } else {
                setDraggable(false);
            }
        };
        window.addEventListener('keydown', handleKey, {passive: true});
        window.addEventListener('keyup', handleKey, {passive: true});
        return () => {
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('keyup', handleKey);
        };
    }, [setDraggable]);

    const toOverlayRect = React.useCallback((areaHighlightRect: AreaHighlightRect): ILTRect | undefined => {

        if (! pageElement) {
            return undefined;
        }

        if (! docScale) {
            return undefined;
        }

        const {scaleValue} = docScale;

        const pageDimensions = computePageDimensions(pageElement);

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

    }, [areaHighlight.position, docScale, pageElement]);

    const handleRegionResize = React.useCallback((overlayRect: ILTRect) => {

        // get the most recent area highlight as since this is using state
        // we can have a stale highlight.

        if (NEW_NOTES_ANNOTATION_BAR_ENABLED && docScale) {
            const docViewerElement = docViewerElements.getDocViewerElement();

            updateBlockAreaHighlight(id, {
                rect: overlayRect,
                pageNum,
                docScale,
                fileType,
                docViewerElement,
            }).catch(err => console.error(err))

        } else {
            const pageMeta = IDocMetas.getPageMeta(docMeta!, pageNum);
            const areaHighlight = (pageMeta.areaHighlights || {})[id];

            onAreaHighlightUpdated({areaHighlight, pageNum, overlayRect});
        }

        return undefined;

    }, [docScale, docViewerElements, updateBlockAreaHighlight, id, pageNum, fileType, docMeta, onAreaHighlightUpdated]);

    const toReactPortal = React.useCallback((rect: IRect, container: HTMLElement) => {

        const areaHighlightRect = AreaHighlightRects.createFromRect(rect);
        const overlayRect = toOverlayRect(areaHighlightRect);

        if (! overlayRect) {
            return null;
        }

        const className = `area-highlight annotation area-highlight-${id}`;

        const color: HighlightColor = areaHighlight.color || 'yellow';
        const backgroundColor = HighlightColors.toBackgroundColor(color, 0.5);

        return ReactDOM.createPortal(
            <ResizeBox
                 id={id}
                 data-type="area-highlight"
                 draggable={draggable}
                 data-doc-fingerprint={fingerprint}
                 data-area-highlight-id={id}
                 data-annotation-id={id}
                 data-page-num={pageNum}
                 // annotation descriptor metadata - might not be needed
                 // anymore
                 data-annotation-type="area-highlight"
                 data-annotation-page-num={pageNum}
                 data-annotation-doc-fingerprint={fingerprint}
                 data-annotation-color={color}
                 className={className}
                 computePosition={() => overlayRect}
                 style={{
                     position: 'absolute',
                     backgroundColor,
                     mixBlendMode: 'multiply',
                     border: `1px solid #c6c6c6`,
                     zIndex: 1
                 }}
                 onResized={handleRegionResize}
                 />,
            container,
            id);

    }, [toOverlayRect, id, areaHighlight.color, draggable, fingerprint, pageNum, handleRegionResize]);

    // const rect = Arrays.first(Object.values(areaHighlight.rects));
    //
    // if (rect) {
    //     return toReactPortal(rect, container)
    // } else {
    //     return null;
    // }

    const portals = Object.values(areaHighlight.rects)
        .map(current => toReactPortal(current, container));

    return (
        <>
            {portals}
        </>
    );

});
