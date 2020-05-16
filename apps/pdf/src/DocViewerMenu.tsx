import {MUIMenuItem} from "../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import * as React from "react";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {useDocViewerCallbacks} from "./DocViewerStore";
import {MenuComponentProps} from "../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import {Elements} from "../../../web/js/util/Elements";


export interface IDocViewerContextMenuOrigin {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly pageNum: number;
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
        x: eventTargetOffset.left + (event.nativeEvent as any).offsetX,
        y: eventTargetOffset.top + (event.nativeEvent as any).offsetY,
        width: pageElement.clientWidth,
        height: pageElement.clientHeight,
        pageNum
    };

}

export const DocViewerMenu = (props: MenuComponentProps<IDocViewerContextMenuOrigin>) => {

    const callbacks = useDocViewerCallbacks();

    const onCreatePagemarkToPoint = React.useCallback(() => {

        if (props.origin) {
            console.log("FIXME: props.origin: ", props.origin);
            callbacks.createPagemarkToPoint(props.origin);
        }

    }, []);

    return (
        <>
            <MUIMenuItem text="Create Pagemark to Point"
                         icon={<BookmarkIcon/>}
                         onClick={onCreatePagemarkToPoint}/>

        </>
    );

}
