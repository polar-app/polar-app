import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import isEqual from "react-fast-compare";
import {ViewOrEditComment2} from "./comments/ViewOrEditComment2";
import {ViewOrEditFlashcard2} from "./flashcards/ViewOrEditFlashcard2";

interface IProps {

    readonly parent: DocAnnotation;
    readonly docAnnotations: ReadonlyArray<DocAnnotation>;

}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const ChildAnnotationSection2 = React.memo((props: IProps) => {

    const docAnnotations = [...props.docAnnotations];

    docAnnotations.sort((a, b) => a.created.localeCompare(b.created));

    const result: any = [];

    docAnnotations.map(child => {

        if (child.annotationType === AnnotationType.COMMENT) {

            result.push (<ViewOrEditComment2 key={child.id}
                                             id={child.id}
                                             comment={child}/>);

        } else {
            result.push (<ViewOrEditFlashcard2 key={child.id}
                                               id={child.id}
                                               flashcard={child}/>);
        }


    });

    return result;

}, isEqual);
