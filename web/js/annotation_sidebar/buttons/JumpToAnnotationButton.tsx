import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {Tooltip} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from "react-router-dom";

function isDocViewer() {
    return document.location.href.indexOf('/doc/') !== -1;
}

export function useJumpToAnnotation(): (annotation: IDocAnnotationRef) => void {

    const history = useHistory();

    return (annotation: IDocAnnotationRef) => {

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

            const annotationElement = document.getElementById(annotation.id);

            history.push({hash: annotation.id});

            if (annotationElement) {
                annotationElement.scrollIntoView();
            } else {
                console.warn("Count not find annotation element to scroll")
            }

        }

        scrollToPage();
        jumpToAnnotation();

    }


}

interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const JumpToAnnotationButton = memoForwardRef((props: IProps) => {

    const jumpToAnnotation = useJumpToAnnotation();

    if (! isDocViewer()) {
        return null;
    }

    const {annotation} = props;

    if (! [AnnotationType.TEXT_HIGHLIGHT, AnnotationType.AREA_HIGHLIGHT].includes(annotation.annotationType)) {
        // this should only be added on text highlights.
        return null;
    }

    return (
        <Tooltip title="Jump to the current annotation in the page.">
            <IconButton size="small"
                        onClick={() => jumpToAnnotation(annotation)}>

                <CenterFocusStrongIcon/>

            </IconButton>
        </Tooltip>
    );
});
