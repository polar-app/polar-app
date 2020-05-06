import * as React from 'react';
import {IDocAnnotation} from '../DocAnnotation';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import isEqual from "react-fast-compare";
import {MUIHoverController} from "../../mui/context/MUIHoverContext";
import {AreaHighlightAnnotationView2} from "./AreaHighlightAnnotationView2";
import {TextHighlightAnnotationView2} from './TextHighlightAnnotationView2';
import {ViewOrEditFlashcard2} from "../child_annotations/flashcards/ViewOrEditFlashcard2";
import {ViewOrEditComment2} from '../child_annotations/comments/ViewOrEditComment2';

const log = Logger.create();

interface IProps {
    readonly annotation: IDocAnnotation;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const AnnotationView2 = React.memo((props: IProps) => {

    const { annotation } = props;

    if (! isPresent(annotation.id)) {
        log.warn("No annotation id!", annotation);
        return null;
    }

    if (annotation.id.trim() === '') {
        log.warn("Empty annotation");
        return null;
    }

    const AnnotationTypeComponent = () => {

        switch (annotation.annotationType) {

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

        }

    };

    const key = 'doc-annotation-' + annotation.id;

    return (
        <div key={key} className="mt-1">
            <MUIHoverController>
                <>
                    <AnnotationTypeComponent/>
                </>
            </MUIHoverController>
        </div>
    );

}, isEqual);

