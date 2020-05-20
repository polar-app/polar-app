import * as React from "react";
import {IDocViewerStore, useDocViewerStore} from "./DocViewerStore";
import {SimpleReactor} from "../../../web/js/reactor/SimpleReactor";
import {PopupStateEvent} from "../../../web/js/ui/popup/PopupStateEvent";
import {TriggerPopupEvent} from "../../../web/js/ui/popup/TriggerPopupEvent";
import {ControlledPopupProps} from "../../../web/js/ui/popup/ControlledPopup";
import {
    AnnotationBarCallbacks,
    OnHighlightedCallback
} from "../../../web/js/ui/annotationbar/ControlledAnnotationBar";
import {HighlightCreatedEvent} from "../../../web/js/comments/react/HighlightCreatedEvent";
import {ControlledAnnotationBars} from "../../../web/js/ui/annotationbar/ControlledAnnotationBars";
import {
    ITextHighlightCreate,
    useAnnotationMutationsContext
} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {TextHighlighter} from "./TextHighlighter";
import ICreateTextHighlightOpts = TextHighlighter.ICreateTextHighlightOpts;

type CreateTextHighlightCallback = (opts: ICreateTextHighlightOpts) => void;

function useCreateTextHighlightCallback(): CreateTextHighlightCallback {

    const annotationMutations = useAnnotationMutationsContext();

    return (opts: ICreateTextHighlightOpts) => {
        const {docMeta, pageMeta, textHighlight}
            = TextHighlighter.createTextHighlight(opts);

        const mutation: ITextHighlightCreate = {
            type: 'create',
            docMeta, pageMeta, textHighlight
        }

        annotationMutations.onTextHighlight(mutation);

    };

}

export function useAnnotationBar() {

    const store = React.useRef<IDocViewerStore | undefined>(undefined)
    const textHighlightCallback = React.useRef<CreateTextHighlightCallback | undefined>(undefined)

    store.current = useDocViewerStore();
    textHighlightCallback.current = useCreateTextHighlightCallback();

    React.useMemo(() => {

        const popupStateEventDispatcher = new SimpleReactor<PopupStateEvent>();
        const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

        const annotationBarControlledPopupProps: ControlledPopupProps = {
            id: 'annotationbar',
            placement: 'top',
            popupStateEventDispatcher,
            triggerPopupEventDispatcher
        };

        const onHighlighted: OnHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {
            console.log("onHighlighted: ", highlightCreatedEvent);

            const callback = textHighlightCallback.current!;
            const docMeta = store.current!.docMeta!;

            callback({
                docMeta,
                pageNum: highlightCreatedEvent.pageNum,
                highlightColor: highlightCreatedEvent.highlightColor,
                selection: highlightCreatedEvent.activeSelection.selection
            })

            // TextHighlighter.computeTextSelections();
        };

        const annotationBarCallbacks: AnnotationBarCallbacks = {
            onHighlighted,
            // onComment
        };

        ControlledAnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks);

    }, []);

}

