import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationType} from '../../metadata/AnnotationType';
import {ViewFlashcard} from './flashcards/ViewFlashcard';
import {ViewOrEditComment} from "./comments/ViewOrEditComment";
import {CommentActions} from "./comments/CommentActions";
import {DocMeta} from "../../metadata/DocMeta";
import {ViewOrEditFlashcard} from './flashcards/ViewOrEditFlashcard';
import {Comment} from '../../metadata/Comment';
import {FlashcardType} from '../../metadata/FlashcardType';
import {FlashcardInputFieldsType} from './flashcards/flashcard_input/FlashcardInputs';
import {FlashcardActions} from './flashcards/FlashcardActions';
import {Flashcard} from '../../metadata/Flashcard';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ChildAnnotationSection extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onComment = this.onComment.bind(this);
        this.onFlashcard = this.onFlashcard.bind(this);


        this.state = {};

    }

    public render() {

        const { children } = this.props;

        children.sort((a, b) => a.created.localeCompare(b.created));

        const result: any = [];

        children.map(child => {

            if (child.annotationType === AnnotationType.COMMENT) {

                result.push (<ViewOrEditComment key={child.id}
                                                id={child.id}
                                                onComment={(html, existingComment) => this.onComment(html, existingComment)}
                                                comment={child}/>);

            } else {
                result.push (<ViewOrEditFlashcard key={child.id}
                                                  id={child.id}
                                                  onFlashcard={(flashcardType, fields, existingFlashcard) => this.onFlashcard(flashcardType, fields, existingFlashcard)}
                                                  flashcard={child}></ViewOrEditFlashcard>);
            }


        });

        return result;

    }

    private onComment(html: string, existingComment: Comment) {
        CommentActions.update(this.props.docMeta, this.props.parent, html, existingComment);
    }

    private onFlashcard(flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>, existingFlashcard?: Flashcard) {
        FlashcardActions.update(this.props.docMeta, this.props.parent, flashcardType, fields, existingFlashcard);
    }

}

interface IProps {

    readonly docMeta: DocMeta;

    readonly parent: DocAnnotation;

    readonly children: DocAnnotation[];

}

interface IState {

}


