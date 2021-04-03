import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {createAnnotationPointer, useJumpToAnnotationHandler} from "../JumpToAnnotationHook";
import {StandardIconButton} from "../../../../apps/repository/js/doc_repo/buttons/StandardIconButton";


interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const JumpToAnnotationButton = memoForwardRef((props: IProps) => {

    const {annotation} = props;

    const jumpToAnnotationHandler = useJumpToAnnotationHandler();

    const handleJumpToCurrentAnnotation = React.useCallback(() => {

        jumpToAnnotationHandler(createAnnotationPointer(annotation));

    }, [annotation, jumpToAnnotationHandler]);

    if (! [AnnotationType.TEXT_HIGHLIGHT, AnnotationType.AREA_HIGHLIGHT].includes(annotation.annotationType)) {
        // this should only be added on text highlights.
        return null;
    }

    return (
        <StandardIconButton tooltip="Jump to annotation."
                            size="small"
                            onClick={handleJumpToCurrentAnnotation}>

            <CenterFocusStrongIcon/>

        </StandardIconButton>
    );
});
