import React from "react";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {useDocViewerStore} from "../../DocViewerStore";
import {AnnotationPopupProvider, useAnnotationPopup} from "./AnnotationPopupContext";
import {AnnotationPopupBar} from "./AnnotationPopupBar";
import {AnnotationPopupActions} from "./AnnotationPopupActions";
import {usePopupBarPosition} from "./AnnotationPopupHooks";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {useResizeObserver} from "../../renderers/pdf/PinchToZoomHooks";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {rangeConstrain} from "../AreaHighlightDrawer";
import {AnnotationPopupShortcuts} from "./AnnotationPopupShortcuts";

const CONTAINER_SPACING = 10;

export const useAnnotationPopupStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
            background: theme.palette.background.default,
            borderRadius: 4,
            boxSizing: "border-box",
        },
        barPadding: {
            padding: 8,
        },
        outer: {
            position: "absolute",
            willChange: "transform",
            top: 0,
            left: 0,
            zIndex: 10,
        },
        inner: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }
    }),
);

const AnnotationPopupContents = React.forwardRef<HTMLDivElement>((_, ref) => {
    const classes = useAnnotationPopupStyles();
    return (
        <div className={classes.outer} ref={ref}>
            <AnnotationPopupShortcuts />
            <Grow in>
                <div className={classes.inner}>
                    <AnnotationPopupActions />
                    <AnnotationPopupBar />
                </div>
            </Grow>
        </div>
    );
});

const constrainToContainer = (container: HTMLElement, popup: HTMLElement, rect: ILTRect): ILTRect => {
    const containerRect = container.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    return {
        ...rect,
        top: rangeConstrain(
            Math.round(rect.top - popupRect.height),
            CONTAINER_SPACING,
            containerRect.height - CONTAINER_SPACING - rect.height,
        ),
        left: rangeConstrain(
            Math.round(rect.left + rect.width / 2 - popupRect.width / 2),
            CONTAINER_SPACING,
            containerRect.width - CONTAINER_SPACING - popupRect.width,
        ),
    };
};

type IAnnotationPopupPDFRendererProps = {
    rect: ILTRect;
};

const AnnotationPopupPDFRenderer: React.FC<IAnnotationPopupPDFRendererProps> = ({ rect }) => {
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const ref = React.useRef<HTMLDivElement>(null);

    const updatePosition = React.useCallback(() => {
        const elem = ref.current;
        const viewerElem = docViewerElementsRef.current.getDocViewerElement().querySelector<HTMLDivElement>("#viewer");
        if (!elem || !viewerElem) {
            return;
        }

        const {left, top} = constrainToContainer(viewerElem, elem, rect);
        ref.current!.style.transform = `translate3d(calc(${left}px), calc(${top}px), 0)`;
    }, [rect, docViewerElementsRef]);

    useResizeObserver(updatePosition, ref);

    React.useEffect(updatePosition, [updatePosition]);

    return <AnnotationPopupContents ref={ref} />;
};

type IAnnotationPopupEPUBRendererProps = {
    rect: ILTRect;
};

const AnnotationPopupEPUBRenderer: React.FC<IAnnotationPopupEPUBRendererProps> = ({ rect }) => {
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const ref = React.useRef<HTMLDivElement>(null);
    const iframeWindow = React.useMemo(() => (
        docViewerElementsRef
            .current
            .getDocViewerElement()
            .querySelector("iframe")
            ?.contentWindow
    ), [docViewerElementsRef]);

    const updatePosition = React.useCallback((elem: HTMLElement) => {
        if (iframeWindow) {
            const {top, left} = constrainToContainer(iframeWindow.document.body, elem, rect);
            elem.style.transform = `translate3d(calc(${left}px), calc(${top - iframeWindow.scrollY}px), 0)`;
        }
    }, [rect, iframeWindow]);

    React.useEffect(() => {
        const elem = ref.current;
        if (elem && iframeWindow) {
            updatePosition(elem);
            const onScroll = () => updatePosition(elem);
            iframeWindow.addEventListener("scroll", onScroll, {passive: true});
            return () => iframeWindow.removeEventListener("scroll", onScroll);
        }
        return;
    }, [docViewerElementsRef, updatePosition, iframeWindow]);

    useResizeObserver(() => {
        if (ref.current) {
            updatePosition(ref.current);
        }
    }, ref);

    return <AnnotationPopupContents ref={ref} />;
};

export const AnnotationPopupRenderer: React.FC = () => {
    const {selectionEvent, annotation} = useAnnotationPopup();
    const rect = usePopupBarPosition({ annotation, selectionEvent });
    const {fileType} = useDocViewerContext();

    if (!rect) {
        return null;
    }

    if (fileType === "pdf") {
        return <AnnotationPopupPDFRenderer rect={rect} />;
    } else if (fileType === "epub") {
        return <AnnotationPopupEPUBRenderer rect={rect} />;
    }

    return null;
};

export const AnnotationPopup: React.FC = () => {
    const {docMeta, docScale}
        = useDocViewerStore(["docMeta", "docScale"]);
    if (!docMeta || !docScale) {
        return null;
    }

    return (
        <AnnotationPopupProvider
            docMeta={docMeta}
            docScale={docScale}
        >
            <AnnotationPopupRenderer />
        </AnnotationPopupProvider>
    );
};

