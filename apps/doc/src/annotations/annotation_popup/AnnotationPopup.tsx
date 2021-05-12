import React from "react";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {useDocViewerContext} from "../../renderers/DocRenderer";
import {IDocScale, useDocViewerStore} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {AnnotationPopupActionProvider, useAnnotationPopupAction} from "./AnnotationPopupActionContext";
import {AnnotationPopupBar} from "./AnnotationPopupBar";
import {AnnotationPopupActions} from "./AnnotationPopupActions";
import {usePopupBarPosition} from "./AnnotationPopupHooks";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {useDocViewerElementsContext} from "../../renderers/DocViewerElementsContext";

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
            zIndex: theme.zIndex.modal,
        },
    }),
);

const AnnotationPopupContents = React.forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div
            style={{
                position: "absolute",
                willChange: "transform",
                top: 0,
                left: 0,
                zIndex: 10,
            }}
            ref={ref}
        >
            <Grow in>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                    id="fudge"
                >
                    <AnnotationPopupActions />
                    <AnnotationPopupBar />
                </div>
            </Grow>
        </div>
    );
});

const AnnotationPopupPDFRenderer: React.FC = () => {
    const {selectionEvent, annotation} = useAnnotationPopupAction();
    const rect = usePopupBarPosition({ annotation, selectionEvent });
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!ref.current || !rect) {
            return;
        }
        const left = rect.left + rect.width / 2;
        const top = rect.top;
        ref.current!.style.transform = `translate3d(calc(${left}px - 50%), calc(${top}px - 100%), 0)`;
    }, [rect]);

    if (!rect) {
        return null;
    }

    return <AnnotationPopupContents ref={ref} />;
};

const AnnotationPopupEPUBRenderer: React.FC = () => {
    const {selectionEvent, annotation} = useAnnotationPopupAction();
    const docViewerElementsRef = useRefWithUpdates(useDocViewerElementsContext());
    const rect = usePopupBarPosition({ annotation, selectionEvent });
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!ref.current || !rect) {
            return;
        }
        const iframeWindow = docViewerElementsRef
            .current
            .getDocViewerElement()
            .querySelector("iframe")
            ?.contentWindow;
        if (iframeWindow) {
            const updatePosition = () => {
                const left = rect.left + rect.width / 2;
                const top = rect.top - iframeWindow.scrollY;
                ref.current!.style.transform = `translate3d(calc(${left}px - 50%), calc(${top}px - 100%), 0)`;
            };
            updatePosition();
            iframeWindow.addEventListener("scroll", updatePosition, {passive: true});
            return () => iframeWindow.removeEventListener("scroll", updatePosition);
        }
        return;
    }, [rect, docViewerElementsRef]);

    if (!rect) {
        return null;
    }

    return <AnnotationPopupContents ref={ref} />;
};

type IAnnotationPopupRendererProps = {
    docScale: IDocScale;
    docMeta: IDocMeta;
};

export const AnnotationPopupRenderer: React.FC<IAnnotationPopupRendererProps> = ({ docMeta, docScale }) => {
    const {fileType} = useDocViewerContext();
    return (
        <AnnotationPopupActionProvider
            docMeta={docMeta}
            docScale={docScale}
        >
            {fileType === "pdf"
                ? <AnnotationPopupPDFRenderer />
                : fileType === "epub"
                    ? <AnnotationPopupEPUBRenderer />
                    : null
            }
        </AnnotationPopupActionProvider>
    );
};

export const AnnotationPopup: React.FC = () => {
    const {docMeta, docScale}
        = useDocViewerStore(["docMeta", "docScale"]);
    if (!docMeta || !docScale) {
        return null;
    }

    return <AnnotationPopupRenderer docMeta={docMeta} docScale={docScale} />
};

