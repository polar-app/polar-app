import React from "react";
import ReactDOM from "react-dom";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {useDocViewerStore} from "../../DocViewerStore";
import {AnnotationPopupProvider, useAnnotationPopup} from "./AnnotationPopupContext";
import {AnnotationPopupBar} from "./AnnotationPopupBar";
import {AnnotationPopupActions} from "./AnnotationPopupActions";
import {useAnnotationPopupPositionUpdater, usePopupBarPosition} from "./AnnotationPopupHooks";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {AnnotationPopupShortcuts} from "./AnnotationPopupShortcuts";
import clsx from "clsx";
import {DeviceRouter} from "../../../../../web/js/ui/DeviceRouter";
import {Devices} from "polar-shared/src/util/Devices";
import {FileType} from "../../../../../web/js/apps/main/file_loaders/FileType";

const IS_HANDHELD = ! Devices.isDesktop();

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
            "&.flipped .annotation_popup-inner": {
                flexDirection: "column-reverse",
            },
            "& .annotation_popup-inner": {
                flexDirection: "column",
            },
        },
        inner: {
            display: "flex",
            alignItems: "flex-start",
        }
    }),
);

const stopPropagation = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
};

const AnnotationPopupContents = React.forwardRef<HTMLDivElement>((_, ref) => {
    const classes = useAnnotationPopupStyles();
    return (
        <div
            ref={ref}
            className={clsx(classes.outer, { ["flipped"]: IS_HANDHELD })}
            // Abort all events to prevent accidentally triggering selection events
            // when interacting with the annotation bar
            onMouseDown={stopPropagation}
            onMouseUp={stopPropagation}
            onTouchStart={stopPropagation}
            onTouchEnd={stopPropagation}
        >
            <AnnotationPopupShortcuts />
            <Grow in>
                <div className={clsx(classes.inner, "annotation_popup-inner")}>
                    <AnnotationPopupActions />
                    <AnnotationPopupBar />
                </div>
            </Grow>
        </div>
    );
});

type IAnnotationPopupPDFRendererProps = {
    rect: ILTRect;
};

const AnnotationPopupPDFRenderer: React.FC<IAnnotationPopupPDFRendererProps> = ({ rect }) => {
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const viewerContainerElem = React.useMemo(() => (
        docViewerElementsRef.current.getDocViewerElement().querySelector<HTMLDivElement>("#viewerContainer")
    ), [docViewerElementsRef]);

    const ref = useAnnotationPopupPositionUpdater({
        rect,
        boundsElement: viewerContainerElem,
        scrollElement: viewerContainerElem,
        noScroll: true,
    });

    return (
        <>
            {viewerContainerElem && ReactDOM.createPortal(<AnnotationPopupContents ref={ref} />, viewerContainerElem)}
        </>
    );
};

interface IAnnotationPopupRendererHandheldProps {
    fileType: FileType;
}

const AnnotationPopupRendererHandheld: React.FC<IAnnotationPopupRendererHandheldProps> = () => {
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const viewerContainerElem = React.useMemo(() => (
        docViewerElementsRef
            .current
            .getDocViewerElement()
            .querySelector<HTMLDivElement>("#docviewer-main-body")
    ), [docViewerElementsRef]);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.style.left = "50%";
            ref.current.style.top = "10px";
            ref.current.style.transform = "translateX(-50%)";
        }
    }, [ref]);

    return (
        <>
            {viewerContainerElem && ReactDOM.createPortal(<AnnotationPopupContents ref={ref} />, viewerContainerElem)}
        </>
    );
};

type IAnnotationPopupEPUBRendererProps = {
    rect: ILTRect;
};

const AnnotationPopupEPUBRenderer: React.FC<IAnnotationPopupEPUBRendererProps> = ({ rect }) => {
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const boundsElement = React.useMemo(() => (
        docViewerElementsRef.current.getDocViewerElement().querySelector<HTMLIFrameElement>("iframe")
    ), [docViewerElementsRef]);
    const scrollElement = React.useMemo(() => boundsElement?.contentWindow || null, [boundsElement]);

    const ref = useAnnotationPopupPositionUpdater({
        rect,
        boundsElement,
        scrollElement,
    });


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
        return (
            <DeviceRouter
                desktop={<AnnotationPopupPDFRenderer rect={rect} />}
                handheld={<AnnotationPopupRendererHandheld fileType={fileType} />}
            />
        );
    } else if (fileType === "epub") {
        return (
            <DeviceRouter
                desktop={<AnnotationPopupEPUBRenderer rect={rect} />}
                handheld={<AnnotationPopupRendererHandheld fileType={fileType} />}
            />
        );
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
