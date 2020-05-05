import * as React from "react";
import {Doc} from "../metadata/Doc";
import {DocAnnotation} from "./DocAnnotation";
import {CreateComment2} from "./child_annotations/comments/CreateComment2";
import isEqual from "react-fast-compare";

interface IProps {
    readonly doc: Doc;
    readonly annotation: DocAnnotation;
}

export const AnnotationInputView = React.memo((props: IProps) => {

    const {annotation} = props;

    return (
        <>
            {/*{annotationInputContext.active === 'text-highlight' &&*/}
            {/*    <EditTextHighlight id={annotation.id}*/}
            {/*                       hidden={annotation.annotationType !== AnnotationType.TEXT_HIGHLIGHT}*/}
            {/*                       active={annotationInputContext.active === 'text-highlight'}*/}
            {/*                       html={annotation.html || ""}*/}
            {/*                       onReset={() => this.onTextHighlightReset()}*/}
            {/*                       onChanged={text => this.onTextHighlightEdited(text)}*/}
            {/*                       onCancel={() => annotationInputContext.setActive('none')}/>*/}

            <CreateComment2/>

            {/*{annotationInputContext.active === 'flashcard' &&*/}
            {/*    <CreateFlashcard id={annotation.id}*/}
            {/*                     defaultValue={annotation.html}*/}
            {/*                     onCancel={() => annotationInputContext.setActive('none')}*/}
            {/*                     onFlashcardCreated={(type, fields) => this.onFlashcardCreated(type, fields)}/>}*/}
        </>
    );
}, isEqual);
