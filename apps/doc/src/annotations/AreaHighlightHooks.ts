import * as React from 'react';
import {
    IAreaHighlightCreate,
    IAreaHighlightUpdate,
    useAnnotationMutationsContext
} from "../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {IPoint} from "../../../../web/js/Point";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {useDocViewerStore} from "../DocViewerStore";
import {AreaHighlightRenderers} from "./AreaHighlightRenderers";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import createAreaHighlightFromEvent = AreaHighlightRenderers.createAreaHighlightFromEvent;
import createAreaHighlightFromOverlayRect = AreaHighlightRenderers.createAreaHighlightFromOverlayRect;
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {UUIDs} from "../../../../web/js/metadata/UUIDs";
import {useCallbackWithTracing} from "../../../../web/js/hooks/UseCallbackWithTracing";

export interface AreaHighlightCreatedOpts {
    readonly pointWithinPageElement: IPoint;
    readonly pageNum: number;
}

export interface AreaHighlightUpdatedOpts {
    readonly areaHighlight: IAreaHighlight;
    readonly overlayRect: ILTRect;
    readonly pageNum: number;
}

interface IAreaHighlightHooks {

    readonly onAreaHighlightCreated: (opts: AreaHighlightCreatedOpts) => void;

    readonly onAreaHighlightUpdated: (opts: AreaHighlightUpdatedOpts) => void;

}

export function useAreaHighlightHooks(): IAreaHighlightHooks {

    const {onAreaHighlight} = useAnnotationMutationsContext();
    const {docScale, docMeta} = useDocViewerStore(['docScale', 'docMeta'], {debug: true});
    const {fileType} = useDocViewerContext();
    const log = useLogger();

    // FIXME: this is the ug... the docViewerStore isn't being updated!!!

    console.log("FIXME: DOC_WRITE useAreaHighlightHooks: got update with docMeta: " + UUIDs.format(docMeta?.docInfo.uuid) );

    const onAreaHighlightCreatedAsync = useCallbackWithTracing('onAreaHighlightCreatedAsync', async (opts: AreaHighlightCreatedOpts) => {

        console.log("FIXME: DOC_WRITE onAreaHighlightCreatedAsync: " + UUIDs.format(docMeta?.docInfo.uuid));

        const {pageNum, pointWithinPageElement} = opts;

        if (docScale && docMeta) {

            const capturedAreaHighlight =
                await createAreaHighlightFromEvent(pageNum,
                    pointWithinPageElement,
                    docScale,
                    fileType);

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            const mutation: IAreaHighlightCreate = {
                type: 'create',
                docMeta,
                pageMeta,
                ...capturedAreaHighlight
            };

            onAreaHighlight(mutation);

        }

    }, [docMeta, docScale, fileType, onAreaHighlight]);

    const onAreaHighlightCreated = React.useCallback((opts: AreaHighlightCreatedOpts) => {

        onAreaHighlightCreatedAsync(opts)
            .catch(err => log.error(err));

    }, [log, onAreaHighlightCreatedAsync]);

    const onAreaHighlightUpdatedAsync = useCallbackWithTracing('onAreaHighlightUpdatedAsync', async (opts: AreaHighlightUpdatedOpts) => {

        const {areaHighlight, pageNum, overlayRect} = opts;

        if (docScale && docMeta) {

            const capturedAreaHighlight =
                await createAreaHighlightFromOverlayRect(pageNum,
                                                         overlayRect,
                                                         docScale,
                                                         fileType);

            const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

            console.log("FIXME: DOC_WRITE onAreaHighlightUpdatedAsync: updating with docMeta: ", UUIDs.format(docMeta?.docInfo.uuid));

            const mutation: IAreaHighlightUpdate = {
                type: 'update',
                docMeta,
                pageMeta,
                ...capturedAreaHighlight,
                areaHighlight,
            };

            console.log("FIXME: DOC_WRITE calling onAreaHighlight...: ", onAreaHighlight);

            onAreaHighlight(mutation);

        }

    }, [docMeta, docScale, fileType, onAreaHighlight]);

    const onAreaHighlightUpdated = useCallbackWithTracing('onAreaHighlightUpdated', (opts: AreaHighlightUpdatedOpts) => {

        onAreaHighlightUpdatedAsync(opts)
            .catch(err => log.error(err));

    }, [log, onAreaHighlightUpdatedAsync]);

    return {onAreaHighlightCreated, onAreaHighlightUpdated};

}

