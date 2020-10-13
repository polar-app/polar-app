import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {useJumpToAnnotationHandler} from "../JumpToAnnotationHook";
import {IAnnotationPtr} from "../AnnotationLinks";
import {StandardIconButton} from "../../../../apps/repository/js/doc_repo/buttons/StandardIconButton";


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
        <StandardIconButton tooltip="Jump to the current annotation in the page."
                            size="small"
                            onClick={handleJumpToCurrentAnnotation}>

            <CenterFocusStrongIcon/>

        </StandardIconButton>
    );
});
