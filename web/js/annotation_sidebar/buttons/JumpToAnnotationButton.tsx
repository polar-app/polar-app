import * as React from "react";
import {memoForwardRef} from "../../react/ReactUtils";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotationRef} from "../DocAnnotation";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import {useJumpToAnnotationHandler} from "../JumpToAnnotationHook";
import {StandardIconButton} from "../../../../apps/repository/js/doc_repo/buttons/StandardIconButton";
import {AnnotationPtrs, IAnnotationPtr} from "../AnnotationPtrs";


interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const JumpToAnnotationButton = memoForwardRef((props: IProps) => {

    const {annotation} = props;

    const jumpToAnnotationHandler = useJumpToAnnotationHandler();

    const handleJumpToCurrentAnnotation = React.useCallback(() => {

        const ptr: IAnnotationPtr = AnnotationPtrs.create({
            target: annotation.id,
            pageNum: annotation.pageNum,
            docID: annotation.docMetaRef.id,
        });

        jumpToAnnotationHandler(ptr);

    }, [annotation.docMetaRef.id, annotation.id, annotation.pageNum, jumpToAnnotationHandler]);

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
