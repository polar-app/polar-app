import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {Tooltip} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import {useJumpToAnnotationHandler} from "../JumpToAnnotationHook";
import {IAnnotationPtr} from "../AnnotationLinks";


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

    const handleJumpToCurrentAnnotation = () => {

        const ptr: IAnnotationPtr = {
            target: annotation.id,
            pageNum: annotation.pageNum,
            docID: annotation.docMetaRef.id,
        };

        jumpToAnnotationHandler(ptr);

    };

    return (
        <Tooltip title="Jump to the current annotation in the page.">
            <IconButton size="small"
                        onClick={handleJumpToCurrentAnnotation}>

                <CenterFocusStrongIcon/>

            </IconButton>
        </Tooltip>
    );
});
