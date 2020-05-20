import {
    IAreaHighlightCreate,
    useAnnotationMutationsContext
} from "../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {IPoint} from "../../../../web/js/Point";
import {DocMetas} from "../../../../web/js/metadata/DocMetas";
import {useDocViewerStore} from "../DocViewerStore";
import {AreaHighlightRenderers} from "./AreaHighlightRenderers";
import {Logger} from "polar-shared/src/logger/Logger";
import createAreaHighlightFromEvent = AreaHighlightRenderers.createAreaHighlightFromEvent;

const log = Logger.create();

export interface AreaHighlightCreatedOpts {
    readonly pointWithinPageElement: IPoint;
    readonly pageNum: number;
}

interface IAreaHighlightHooks {
    readonly onAreaHighlightCreated: (opts: AreaHighlightCreatedOpts) => void;
}

export function useAreaHighlightHooks(): IAreaHighlightHooks {

    const {onAreaHighlight} = useAnnotationMutationsContext();
    const {docScale, docMeta} = useDocViewerStore();

    function onAreaHighlightCreated(opts: AreaHighlightCreatedOpts) {

        const {pageNum, pointWithinPageElement} = opts;

        async function doAsync() {

            if (docScale && docMeta) {

                const point: IPoint = pointWithinPageElement;

                const capturedAreaHighlight =
                    await createAreaHighlightFromEvent(pageNum,
                                                       point,
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

    return {onAreaHighlightCreated};

}

