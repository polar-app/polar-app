import * as React from 'react';
import {IDocAnnotation} from '../DocAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import isEqual from "react-fast-compare";
import {ViewOrEditComment2} from "./comments/ViewOrEditComment2";
import {ViewOrEditFlashcard2} from "./flashcards/ViewOrEditFlashcard2";

interface IProps {
    readonly docAnnotations: ReadonlyArray<IDocAnnotation>;
}

interface IChildAnnotationProps {
    readonly child: IDocAnnotation;
}

export const ChildAnnotation = React.memo((props: IChildAnnotationProps) => {

    const {child} = props;

    if (child.annotationType === AnnotationType.COMMENT) {

        return (
            <ViewOrEditComment2 comment={child}/>
        );

    } else {
        return (
            <ViewOrEditFlashcard2 flashcard={child}/>);
    }

}, isEqual);

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const ChildAnnotationSection2 = React.memo((props: IProps) => {

    const docAnnotations = [...props.docAnnotations];

    docAnnotations.sort((a, b) => a.created.localeCompare(b.created));

    const mapped = docAnnotations.map(child => (
        <div key={child.id} className="ml-3">
            <ChildAnnotation child={child}/>
        </div>
    ));

    return (
        <>
            {mapped}
        </>
    );

}, isEqual);
