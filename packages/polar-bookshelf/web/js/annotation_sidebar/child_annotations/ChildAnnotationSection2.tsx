import * as React from 'react';
import {IDocAnnotationRef} from '../DocAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import isEqual from "react-fast-compare";
import {ViewOrEditComment2} from "./comments/ViewOrEditComment2";
import {ViewOrEditFlashcard2} from "./flashcards/ViewOrEditFlashcard2";

interface IProps {
    readonly parent: IDocAnnotationRef;
    readonly docAnnotations: ReadonlyArray<IDocAnnotationRef>;
}

interface IChildAnnotationProps {
    readonly parent: IDocAnnotationRef;
    readonly child: IDocAnnotationRef;
}

export const ChildAnnotation = React.memo(function ChildAnnotation(props: IChildAnnotationProps) {

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
        <div key={child.id} className="ml-3 mt-1">
            <ChildAnnotation parent={props.parent} child={child}/>
        </div>
    ));

    return (
        <>
            {mapped}
        </>
    );

}, isEqual);
