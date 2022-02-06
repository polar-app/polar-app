import * as React from "react";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {AreaHighlightRects} from "../../../../web/js/metadata/AreaHighlightRects";
import * as ReactDOM from "react-dom";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {ResizeBox} from "./ResizeBox";
import {useDocViewerStore} from "../DocViewerStore";
import {useDocViewerElementsContext} from "../renderers/DocViewerElementsContext";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {IBlockAreaHighlight} from "polar-blocks/src/annotations/IBlockAreaHighlight";
import {useBlockAreaHighlight} from "../../../../web/js/notes/HighlightBlocksHooks";
import {useDocViewerContext} from "../renderers/DocRenderer";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import {useTheme} from "@material-ui/core";
import {HandleStyles} from "react-rnd";
import {useToOverlayRect} from "./AreaHighlightRenderer";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly areaHighlight: IBlockAreaHighlight;
    readonly container: HTMLElement;
    readonly id: string;
}

export const AreaHighlightRendererHandheld = deepMemo(function AreaHighlightRenderer(props: IProps) {

    const {areaHighlight, fingerprint, pageNum, container, id} = props;
    const {docScale} = useDocViewerStore(['docScale']);
    const {areaHighlightMode} = useDocViewerStore(['areaHighlightMode']);
    const {update: updateBlockAreaHighlight} = useBlockAreaHighlight();
    const {fileType} = useDocViewerContext();
    const docViewerElements = useDocViewerElementsContext();
    const theme = useTheme();

    const toOverlayRect = useToOverlayRect(areaHighlight, pageNum);

    const handleRegionResize = React.useCallback((overlayRect: ILTRect) => {

        // get the most recent area highlight as since this is using state
        // we can have a stale highlight.

        if (docScale) {
            const docViewerElement = docViewerElements.getDocViewerElement();

            updateBlockAreaHighlight(id, {
                rect: overlayRect,
                pageNum,
                docScale,
                fileType,
                docViewerElement,
            }).catch(err => console.error(err))

        }

        return undefined;

    }, [docScale, docViewerElements, updateBlockAreaHighlight, id, pageNum, fileType]);

    const phoneResizeHandleStyles: HandleStyles = React.useMemo(() => {
        const base = {
            width: 5,
            height: 5,
            background: theme.palette.text.primary,
            zIndex: 100,
        };

        return {
            topLeft: { ...base, transform: 'translate3d(-50%, -50%, 0)' },
            topRight: { ...base, transform: 'translate3d(50%, -50%, 0)' },
            bottomLeft: { ...base, transform: 'translate3d(-50%, 50%, 0)' },
            bottomRight: { ...base, transform: 'translate3d(50%, 50%, 0)' },
        };
    }, [theme]);

    const actionsEnabled = areaHighlightMode;

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
                draggable={actionsEnabled}
                data-doc-fingerprint={fingerprint}
                data-area-highlight-id={id}
                data-annotation-id={id}
                data-page-num={pageNum}
                resizeHandleStyles={actionsEnabled ? phoneResizeHandleStyles : undefined}
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
                    zIndex: 1,
                }}
                onResized={handleRegionResize}
                enableResizing={actionsEnabled}
            >
                {actionsEnabled && (
                    <DragIndicatorIcon
                        className="areahighlight-handle"
                        fontSize="small"
                        style={{
                            position: 'absolute',
                            left: `calc(100% + 6px)`,
                            top: 0,
                            cursor: 'move',
                            zIndex: 10,
                        }}
                    />
                )}
            </ResizeBox>,
            container,
            id,
        );

    }, [
        toOverlayRect,
        id,
        areaHighlight.color,
        actionsEnabled,
        fingerprint,
        pageNum,
        handleRegionResize,
        phoneResizeHandleStyles,
    ]);

    const portals = Object.values(areaHighlight.rects)
        .map(current => toReactPortal(current, container));

    return <>{portals}</>;

});
