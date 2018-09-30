import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {CommentPopupBox} from './CommentPopupBox';
import {Elements} from '../../util/Elements';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {CommentInputEvent} from './CommentInputEvent';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {CommentCreatedEvent} from './CommentCreatedEvent';

export class CommentPopupBoxes {

    public static create(commentEventDispatcher: IEventDispatcher<CommentInputEvent>,
                         commentHandler: OnCommentHandler) {

        const popupElement = CommentPopupBoxes.createPopupElement();
        document.body.appendChild(popupElement);
        CommentPopupBoxes.render(popupElement, commentEventDispatcher, commentHandler);

    }

    private static createPopupElement() {

        const style = `width: 600px; height: 250px;`;

        return Elements.createElementHTML(`<div id="comments-popup" style="${style}"></div>`);

    }

    private static render(target: HTMLElement,
                          commentEventDispatcher: IEventDispatcher<CommentInputEvent>,
                          commentHandler: OnCommentHandler) {

        ReactDOM.render(
            <CommentPopupBox commentEventDispatcher={commentEventDispatcher} onComment={commentHandler}/>,
            target
        );

    }

}

export interface CommentPopup {
    popupElement: HTMLElement;
}

export type OnCommentHandler = (commentCreatedEvent: CommentCreatedEvent) => void;

