import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationType} from '../../metadata/AnnotationType';
import {FlashcardComponent} from './FlashcardComponent';
import {ViewOrEditComment} from "./comments/ViewOrEditComment";
import {CommentActions} from "./comments/CommentActions";
import {DocMeta} from "../../metadata/DocMeta";

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ChildAnnotationSection extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { children } = this.props;

        const result: any = [];

        children.map(child => {

            if (child.annotationType === AnnotationType.COMMENT) {

                result.push (<ViewOrEditComment key={child.id}
                                                id={child.id}
                                                onComment={(html, existingComment) => CommentActions.update(this.props.docMeta, child, html, existingComment)}
                                                comment={child}/>);

            } else {
                result.push (<FlashcardComponent key={child.id} flashcard={child}></FlashcardComponent>);
            }


        });

        return result;

    }

}

interface IProps {

    readonly docMeta: DocMeta;

    readonly children: DocAnnotation[];

}

interface IState {

}


