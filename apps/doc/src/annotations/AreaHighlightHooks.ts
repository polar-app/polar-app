import {
    IAreaHighlightCreate,
    IAreaHighlightUpdate,
    useAnnotationMutationsContext
} from "../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {IPoint} from "../../../../web/js/Point";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {useDocViewerStore} from "../DocViewerStore";
import {AreaHighlightRenderers} from "./AreaHighlightRenderers";
import {Logger} from "polar-shared/src/logger/Logger";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import createAreaHighlightFromEvent = AreaHighlightRenderers.createAreaHighlightFromEvent;
import createAreaHighlightFromOverlayRect = AreaHighlightRenderers.createAreaHighlightFromOverlayRect;

const log = Logger.create();

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
    const {docScale, docMeta} = useDocViewerStore();

    function onAreaHighlightCreated(opts: AreaHighlightCreatedOpts) {

        const {pageNum, pointWithinPageElement} = opts;

        async function doAsync() {

            if (docScale && docMeta) {

                const capturedAreaHighlight =
                    await createAreaHighlightFromEvent(pageNum,
                                                       pointWithinPageElement,
                                                       docScale);

                const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

                const mutation: IAreaHighlightCreate = {
                    type: 'create',
                    docMeta,
                    pageMeta,
                    ...capturedAreaHighlight
                };

                onAreaHighlight(mutation);

            }

        }

        // FIXME: better error handling
        doAsync()
            .catch(err => log.error(err));

    }

    function onAreaHighlightUpdated(opts: AreaHighlightUpdatedOpts) {

        const {areaHighlight, pageNum, overlayRect} = opts;

        async function doAsync() {

            if (docScale && docMeta) {

                const capturedAreaHighlight =
                    await createAreaHighlightFromOverlayRect(pageNum,
                                                             overlayRect,
                                                             docScale);

                const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

                const mutation: IAreaHighlightUpdate = {
                    type: 'update',
                    docMeta,
                    pageMeta,
                    ...capturedAreaHighlight,
                    areaHighlight,
                };

                onAreaHighlight(mutation);

            }

        }

        // FIXME: better error handling
        doAsync()
            .catch(err => log.error(err));

    }

    return {onAreaHighlightCreated, onAreaHighlightUpdated};

}

