import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {Tooltip} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import {useJumpToAnnotationHandler} from "../JumpToAnnotationHook";


interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const JumpToAnnotationButton = memoForwardRef((props: IProps) => {

    const jumpToAnnotationHandler = useJumpToAnnotationHandler();

    const {annotation} = props;

    if (! [AnnotationType.TEXT_HIGHLIGHT, AnnotationType.AREA_HIGHLIGHT].includes(annotation.annotationType)) {
        // this should only be added on text highlights.
        return null;
    }

    return (
        <Tooltip title="Jump to the current annotation in the page.">
            <IconButton size="small"
                        onClick={() => jumpToAnnotationHandler(annotation)}>

                <CenterFocusStrongIcon/>

            </IconButton>
        </Tooltip>
    );
});
