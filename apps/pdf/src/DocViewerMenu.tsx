import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import {MenuComponentProps} from "../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import {Elements} from "../../../web/js/util/Elements";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {IPoint} from "../../../web/js/Point";
import {Logger} from "polar-shared/src/logger/Logger";
import {useAreaHighlightHooks} from "./annotations/AreaHighlightHooks";
import {MUISubMenu} from "../../../web/js/mui/menu/MUISubMenu";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {
    IAnnotationMeta,
    IAnnotationRef
} from "polar-shared/src/metadata/AnnotationRefs";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {useAnnotationMutationsContext} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDocMetaContext} from "../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {DocMetas} from "polar-shared/src/metadata/DocMetas";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

const log = Logger.create();

type AnnotationMetaResolver = (annotationMeta: IAnnotationMeta) => IAnnotationRef;

function useAnnotationMetaResolver(): AnnotationMetaResolver {

    const {docMeta} = useDocViewerStore();

    return (annotationMeta: IAnnotationMeta): IAnnotationRef => {

        const {id, annotationType, pageNum} = annotationMeta;

        if (! docMeta) {
            throw new Error("No docMeta");
        }

        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

        function getOriginal(): IPagemark | ITextHighlight | IAreaHighlight {

            switch (annotationType) {
                case AnnotationType.PAGEMARK:
                    return (pageMeta.pagemarks || {})[id];
                case AnnotationType.TEXT_HIGHLIGHT:
                    return (pageMeta.textHighlights || {})[id];
                case AnnotationType.AREA_HIGHLIGHT:
                    return (pageMeta.areaHighlights || {})[id];
                default:
                    throw new Error("Unsupported annotationType: " + annotationMeta.annotationType);
            }

        }

        const original = getOriginal();

        console.log("FIXME1: id", id);

        return {
            id, annotationType, pageNum,
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            original
        }

    }

}

export interface IDocViewerContextMenuOrigin {

    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly pageNum: number;
    readonly clientX: number;
    readonly clientY: number;
    readonly pointWithinPageElement: IPoint;

    readonly pagemarks: ReadonlyArray<IAnnotationMeta>;
    readonly areaHighlights: ReadonlyArray<IAnnotationMeta>;
    readonly textHighlights: ReadonlyArray<IAnnotationMeta>;

}

/**
 * Pagemarks have pointer-events: none and they don't show up when using
 * elementsFromPoint so we have to temporarily enable them.
 */
function withPointerEvents<T>(element: HTMLElement,
                              className: string,
                              delegate: () => T) {

    interface ElementStyleRestore {
        readonly element: HTMLElement;
        readonly pointerEvents: string | null;
    }

    const elements = Array.from(element.querySelectorAll("." + className)) as ReadonlyArray<HTMLElement>;

    const elementStyleRestores: ElementStyleRestore[] = [];

    for (const element of elements) {

        elementStyleRestores.push({
            element,
            pointerEvents: element.style.pointerEvents
        });

        element.style.pointerEvents = 'auto';

    }

    try {

        return delegate();

    } finally {

        for (const restore of elementStyleRestores) {
            restore.element.style.pointerEvents = restore.pointerEvents;
        }

    }

}

function selectedElements(pageElement: HTMLElement,
                          point: IPoint,
                          className: string): ReadonlyArray<HTMLElement> {

    return withPointerEvents(pageElement, className, () => {

        const elements = document.elementsFromPoint(point.x, point.y) as HTMLElement[];
        return elements.filter(element => element.classList.contains(className));

    })

}

function selectedAnnotationMetas(pageElement: HTMLElement,
                                 pageNum: PageNumber,
                                 annotationType: AnnotationType,
                                 point: IPoint,
                                 className: string): ReadonlyArray<IAnnotationMeta> {

    function toAnnotationMeta(element: HTMLElement): IAnnotationMeta {
        const id = element.getAttribute("data-annotation-id");
        if (! id) {
            throw new Error("No id for annotation type: " + annotationType);
        }
        return {id, pageNum, annotationType};
    }

    return selectedElements(pageElement, point, className).map(toAnnotationMeta);

}

export function computeDocViewerContextMenuOrigin(event: React.MouseEvent<HTMLElement, MouseEvent>): IDocViewerContextMenuOrigin | undefined {

    const target = event.target as HTMLElement;

    const pageElement = Elements.untilRoot(target, ".page");
    if (! pageElement) {
        return undefined;
    }

    const pageNum = parseInt(pageElement.getAttribute("data-page-number"))

    const eventTargetOffset = Elements.getRelativeOffsetRect(target, pageElement);

    function computePointWithinPageElement(): IPoint {

        const pageElementBCR = pageElement.getBoundingClientRect();

        return {
            x: event.clientX - pageElementBCR.x,
            y: event.clientY - pageElementBCR.y
        };

    }

    const pointWithinPageElement = computePointWithinPageElement();

    const point = {x: event.clientX, y: event.clientY};

    const pagemarks = selectedAnnotationMetas(pageElement, pageNum, AnnotationType.PAGEMARK, point, 'pagemark');
    const areaHighlights = selectedAnnotationMetas(pageElement, pageNum, AnnotationType.AREA_HIGHLIGHT, point, 'area-highlight');
    const textHighlights = selectedAnnotationMetas(pageElement, pageNum, AnnotationType.TEXT_HIGHLIGHT, point, 'text-highlight');

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        x: eventTargetOffset.left + (event.nativeEvent as any).offsetX,
        y: eventTargetOffset.top + (event.nativeEvent as any).offsetY,
        width: pageElement.clientWidth,
        height: pageElement.clientHeight,
        pointWithinPageElement,
        pageNum,
        pagemarks,
        areaHighlights,
        textHighlights
    };

}

export const DocViewerMenu = (props: MenuComponentProps<IDocViewerContextMenuOrigin>) => {

    const {onPagemark} = useDocViewerCallbacks();
    const {onAreaHighlightCreated} = useAreaHighlightHooks();
    const annotationMutationsContext = useAnnotationMutationsContext();
    const docMetaContext = useDocMetaContext();
    const annotationMetaResolver = useAnnotationMetaResolver();

    const origin = props.origin!;

    const onCreatePagemarkToPoint = React.useCallback(() => {

        onPagemark({
            type: 'create',
            ...origin,
        });

    }, []);

    const onCreateAreaHighlight = () => {
        const {pageNum, pointWithinPageElement} = origin;
        onAreaHighlightCreated({pageNum, pointWithinPageElement});
    }

    const onDelete = (annotations: ReadonlyArray<IAnnotationMeta>) => {

        const selected = annotations.map(annotationMetaResolver);

        annotationMutationsContext.onDeleted({selected});

    }

    return (
        <>
            <MUIMenuItem text="Create Pagemark to Point"
                         icon={<BookmarkIcon/>}
                         onClick={onCreatePagemarkToPoint}/>

            <MUIMenuItem text="Create Area Highlight"
                         icon={<PhotoSizeSelectLargeIcon/>}
                         onClick={onCreateAreaHighlight}/>

            {(props.origin?.pagemarks?.length || 0) > 0 &&
                <MUISubMenu text="Pagemark"
                            icon={<BookmarkIcon/>}>

                    <MUIMenuItem text="Delete"
                                 icon={<DeleteForeverIcon/>}
                                 onClick={() => onDelete(origin.pagemarks)}/>

                </MUISubMenu>}


        </>
    );

}
