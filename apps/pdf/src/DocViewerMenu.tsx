import {MUIMenuItem} from "../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import {MenuComponentProps} from "../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import {Elements} from "../../../web/js/util/Elements";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import {useAnnotationMutationsContext} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {AreaHighlightRenderers} from "./annotations/AreaHighlightRenderers";
import {IPoint} from "../../../web/js/Point";

export interface IDocViewerContextMenuOrigin {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly pageNum: number;
    readonly clientX: number;
    readonly clientY: number;
}

export function computeDocViewerContextMenuOrigin(event: React.MouseEvent<HTMLElement, MouseEvent>) {

    const target = event.target as HTMLElement;

    const pageElement = Elements.untilRoot(target, ".page");
    if (! pageElement) {
        return undefined;
    }

    const pageNum = parseInt(pageElement.getAttribute("data-page-number"))

    const eventTargetOffset = Elements.getRelativeOffsetRect(target, pageElement);

    return {
        clientX: event.clientX,
        clientY: event.clientY,
        x: eventTargetOffset.left + (event.nativeEvent as any).offsetX,
        y: eventTargetOffset.top + (event.nativeEvent as any).offsetY,
        width: pageElement.clientWidth,
        height: pageElement.clientHeight,
        pageNum
    };

}

export const DocViewerMenu = (props: MenuComponentProps<IDocViewerContextMenuOrigin>) => {

    const {docScale} = useDocViewerStore();
    const {onPagemark} = useDocViewerCallbacks();
    const {onAreaHighlight} = useAnnotationMutationsContext();

    const onCreatePagemarkToPoint = React.useCallback(() => {

        if (props.origin) {

            onPagemark({
                type: 'create',
                ...props.origin,
            });

        }

    }, []);

    const onCreateAreaHighlight = React.useCallback(() => {

        // FIXME: docScale is only being set on resize.. there isn't an initial value.
        console.log("FIXME: props.origin: ", props.origin);
        console.log("FIXME: docScale: ", docScale);

        if (props.origin && docScale) {

            const clientPoint: IPoint = {
                x: props.origin.clientX,
                y: props.origin.clientY
            };

            const areaHighlight = AreaHighlightRenderers.createAreaHighlightFromEvent(clientPoint, docScale);

            // onAreaHighlight({
            //     type: 'create',
            //     ...props.origin,
            // });

        }

    }, []);

    return (
        <>
            <MUIMenuItem text="Create Pagemark to Point"
                         icon={<BookmarkIcon/>}
                         onClick={onCreatePagemarkToPoint}/>

            <MUIMenuItem text="Create Area Highlight"
                         icon={<PhotoSizeSelectLargeIcon/>}
                         onClick={onCreateAreaHighlight}/>

        </>
    );

}
