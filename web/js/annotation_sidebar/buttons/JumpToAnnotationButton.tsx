import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {Tooltip} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';

export function onJumpToAnnotation(annotation: IDocAnnotationRef) {

    function computePageElement() {
        // TODO: this isn't portable to multi-tab view in the Electron app
        const pageElements = Array.from(document.querySelectorAll(".page"));
        return pageElements[annotation.pageNum - 1] as HTMLElement;
    }

    function scrollToPage() {
        const pageElement = computePageElement();
        pageElement.scrollIntoView();
    }

    function jumpToAnnotation() {
        document.location.hash = annotation.id;
    }

    scrollToPage();
    jumpToAnnotation();

}

interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const JumpToAnnotationButton = memoForwardRef((props: IProps) => {

    const {annotation} = props;

    if (! [AnnotationType.TEXT_HIGHLIGHT, AnnotationType.AREA_HIGHLIGHT].includes(annotation.annotationType)) {
        // this should only be added on text highlights.
        return null;
    }

    return (
        <Tooltip title="Jump to the current annotation in the page.">
            <IconButton size="small"
                        onClick={() => onJumpToAnnotation(annotation)}>

                <CenterFocusStrongIcon/>

            </IconButton>
        </Tooltip>
    );
});
