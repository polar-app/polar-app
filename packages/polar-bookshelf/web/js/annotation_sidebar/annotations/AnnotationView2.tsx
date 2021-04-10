import * as React from 'react';
import {IDocAnnotationRef} from '../DocAnnotation';
import {isPresent} from 'polar-shared/src/Preconditions';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
// import {MUIHoverController} from "../../mui/context/MUIHoverContext";
import {AreaHighlightAnnotationView2} from "./AreaHighlightAnnotationView2";
import {TextHighlightAnnotationView2} from './TextHighlightAnnotationView2';
import {ViewOrEditFlashcard2} from "../child_annotations/flashcards/ViewOrEditFlashcard2";
import {ViewOrEditComment2} from '../child_annotations/comments/ViewOrEditComment2';
import {AnnotationInputView} from "../AnnotationInputView";
import {ChildAnnotationSection2} from "../child_annotations/ChildAnnotationSection2";
import {deepMemo} from "../../react/ReactUtils";
import {useScrollIntoViewUsingLocation} from "../../../../apps/doc/src/annotations/ScrollIntoViewUsingLocation";
// import {createContextMenu} from "../../../../apps/repository/js/doc_repo/MUIContextMenu2";
// import {IDocViewerContextMenuOrigin} from "../../../../apps/doc/src/DocViewerMenu";
// import {MUIDocDropdownMenuItems} from "../../../../apps/repository/js/doc_repo/MUIDocDropdownMenuItems";

interface IProps {
    readonly annotation: IDocAnnotationRef;
}

const AnnotationTypeComponent = deepMemo(function AnnotationTypeComponent(props: IProps) {

    const { annotation } = props;

    switch (annotation.annotationType) {

        // TODO: AnnotationRepoTableContextMenu here? or in TextHighlightAnnotationView2 ?

        case AnnotationType.AREA_HIGHLIGHT:
            return (
                <AreaHighlightAnnotationView2 annotation={annotation}/>
            );

        case AnnotationType.TEXT_HIGHLIGHT:
            return (
                <TextHighlightAnnotationView2 annotation={annotation}/>
            );

        case AnnotationType.FLASHCARD:
            return (
                <ViewOrEditFlashcard2 flashcard={annotation}/>
            );

        case AnnotationType.COMMENT:
            return (
                <ViewOrEditComment2 comment={annotation}/>
            );

        default:
            return null;

    }

});

// export const [AnnotationContextMenu, useAnnotationContextMenu]
//     = createContextMenu<IDocViewerContextMenuOrigin>(MUIDocDropdownMenuItems);

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const AnnotationView2 = deepMemo((props: IProps) => {

    const { annotation } = props;

    const scrollIntoViewRef = useScrollIntoViewUsingLocation();

    if (! isPresent(annotation.id)) {
        console.warn("No annotation id!", annotation);
        return null;
    }

    if (annotation.id.trim() === '') {
        console.warn("Empty annotation");
        return null;
    }

    const key = 'doc-annotation-' + annotation.id;

    return (
        <div key={key}
             ref={scrollIntoViewRef}
             id={'annotation-' + annotation.id}
             className="">
            {/*<MUIHoverController>*/}
                <>

                    <AnnotationTypeComponent {...props}/>

                    <AnnotationInputView annotation={annotation}/>

                    <div className="comments">
                        <ChildAnnotationSection2 parent={annotation}
                                                 docAnnotations={annotation.children()}/>
                    </div>

                </>
            {/*</MUIHoverController>*/}
        </div>
    );

});
