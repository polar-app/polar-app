import * as React from "react";
import {IDocAnnotation} from "./DocAnnotation";
import {CreateComment2} from "./child_annotations/comments/CreateComment2";
import isEqual from "react-fast-compare";
import {EditTextHighlight} from "./child_annotations/comments/EditTextHighlight";
import {EditTextHighlight2} from "./child_annotations/comments/EditTextHighlight2";

interface IProps {
    readonly annotation: IDocAnnotation;
}

export const AnnotationInputView = React.memo((props: IProps) => {

    const {annotation} = props;

    return (
        <>
            <EditTextHighlight2 id={annotation.id}
                                html={annotation.html || ""}
                                annotation={annotation}
                                />

            <CreateComment2/>

            {/*{annotationInputContext.active === 'flashcard' &&*/}
            {/*    <CreateFlashcard id={annotation.id}*/}
            {/*                     defaultValue={annotation.html}*/}
            {/*                     onCancel={() => annotationInputContext.setActive('none')}*/}
            {/*                     onFlashcardCreated={(type, fields) => this.onFlashcardCreated(type, fields)}/>}*/}
        </>
    );
}, isEqual);
