import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import {
    IPagemarkDelete,
    useDocViewerCallbacks,
    useDocViewerStore
} from "./DocViewerStore";
import {
    IMouseEvent,
    MenuComponentProps
} from "../../repository/js/doc_repo/MUIContextMenu";
import {Elements} from "../../../web/js/util/Elements";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {IPoint} from "../../../web/js/Point";
import {useAreaHighlightHooks} from "./annotations/AreaHighlightHooks";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {
    IAnnotationMeta,
    IAnnotationRef
} from "polar-shared/src/metadata/AnnotationRefs";
import {PageNumber} from "polar-shared/src/metadata/IPageMeta";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {useAnnotationMutationsContext} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {DocMetas} from "polar-shared/src/metadata/DocMetas";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Numbers} from "polar-shared/src/util/Numbers";
import {InvalidInput} from "../../../web/js/ui/dialogs/InputValidators";
import {FileType} from "../../../web/js/apps/main/file_loaders/FileType";

type AnnotationMetaResolver = (annotationMeta: IAnnotationMeta) => IAnnotationRef;

function useAnnotationMetaResolver(): AnnotationMetaResolver {

    const {docMeta} = useDocViewerStore(['docMeta']);

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
            restore.element.style.pointerEvents = restore.pointerEvents!;
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

export function computeDocViewerContextMenuOrigin(event: IMouseEvent): IDocViewerContextMenuOrigin | undefined {

    const target = event.target as HTMLElement;

    interface ContextPageMeta {
        readonly fileType: FileType;
        readonly pageElement: HTMLElement;
        readonly pageNum: number;
    }

    function computeContextPageMeta(): ContextPageMeta {

        function computePageElementWithFileType(): [HTMLElement, FileType] {

            const pageElement = Elements.untilRoot(target, ".page");

            if (pageElement) {
                return [pageElement, 'pdf'];
            }

            // find the root .page in PDF mode or document.body when in EPUB
            return [document.body, 'epub'];

        }

        const [pageElement, fileType] = computePageElementWithFileType();

        function parsePageNumFromPageElement(pageElement: HTMLElement) {
            return parseInt(pageElement.getAttribute("data-page-number")!)
        }

        function computePageNumForPDF(): number {
            return parsePageNumFromPageElement(pageElement);
        }

        function computePageNumForEPUB(): number {
            const pageElement = Elements.untilRoot(event.nativeEvent.view!.frameElement as HTMLElement, '.page');
            return parsePageNumFromPageElement(pageElement);
        }

        function computePageNum() {

            switch (fileType) {
                case "pdf":
                    return computePageNumForPDF();
                case "epub":
                    return computePageNumForEPUB();
            }

        }

        const pageNum = computePageNum();

        return {pageElement, pageNum, fileType};

    }

    const {pageElement, pageNum} = computeContextPageMeta();

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

    const {docDescriptor} = useDocViewerStore(['docDescriptor']);
    const {onPagemark} = useDocViewerCallbacks();
    const {onAreaHighlightCreated} = useAreaHighlightHooks();
    const annotationMutationsContext = useAnnotationMutationsContext();
    const annotationMetaResolver = useAnnotationMetaResolver();
    const dialogManager = useDialogManager();

    const origin = props.origin!;

    const onCreatePagemarkToPoint = React.useCallback(() => {

        onPagemark({
            type: 'create-to-point',
            ...origin,
        });

    }, []);

    const onCreatePagemarkFromPage = React.useCallback(() => {

        function onDone(fromPage: number) {

            onPagemark({
                type: 'create-from-page',
                ...origin,
                fromPage
            });

        }

        const nrPages = docDescriptor!.nrPages;

        function inputValidator(value: string): InvalidInput | undefined {

            function createResult(message: string): InvalidInput {
                return {message};
            }

            if (! Numbers.isNumber(value)) {
                return createResult("Input given must be a number");
            }

            const fromPage = parseInt(value);

            if (fromPage <= 0) {
                return createResult("Page must start at 1.");
            }

            if (fromPage > nrPages) {
                return createResult(`Page too large. Document is only ${nrPages} in length`);
            }

            if (fromPage > origin.pageNum) {
                return createResult("Page may not exceed " + origin.pageNum);
            }

            return undefined;

        }

        const pageLimit = Math.min(nrPages, origin.pageNum);

        dialogManager.prompt({
            title: "Create Pagemark From Page",
            description: "Enter a starting page from which to create the pagemark: ",
            placeholder: `Enter a page from 1 to ${pageLimit}`,
            type: 'number',
            autoComplete: 'off',
            inputValidator,
            onCancel: NULL_FUNCTION,
            onDone: (value: string) => onDone(parseInt(value))
        });

    }, []);

    const onCreateAreaHighlight = () => {
        const {pageNum, pointWithinPageElement} = origin;
        onAreaHighlightCreated({pageNum, pointWithinPageElement});
    }

    const onDeletePagemark = (annotations: ReadonlyArray<IAnnotationMeta>) => {

        function toMutation(mutation: IAnnotationRef): IPagemarkDelete {
            return {
                type: 'delete',
                pageNum: mutation.pageNum,
                pagemark: mutation.original as IPagemark
            }
        }

        annotations.map(annotationMetaResolver)
                   .map(toMutation)
                   .forEach(onPagemark);

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

            {origin.pageNum > 1 && (
                <MUIMenuItem text="Create Pagemark from Page To Point"
                             icon={<BookmarksIcon/>}
                             onClick={onCreatePagemarkFromPage}/>)}

            <MUIMenuItem text="Create Area Highlight"
                         icon={<PhotoSizeSelectLargeIcon/>}
                         onClick={onCreateAreaHighlight}/>

            {(props.origin?.pagemarks?.length || 0) > 0 &&
                <MUIMenuItem text="Delete Pagemark"
                             icon={<DeleteForeverIcon/>}
                             onClick={() => onDeletePagemark(origin.pagemarks)}/>}

            {(props.origin?.areaHighlights?.length || 0) > 0 &&
                <MUIMenuItem text="Delete Area Highlight"
                             icon={<DeleteForeverIcon/>}
                             onClick={() => onDelete(origin.areaHighlights)}/>}

            {(props.origin?.textHighlights?.length || 0) > 0 &&
                <MUIMenuItem text="Delete Text Highlight"
                             icon={<DeleteForeverIcon/>}
                             onClick={() => onDelete(origin.textHighlights)}/>}

        </>
    );

}
