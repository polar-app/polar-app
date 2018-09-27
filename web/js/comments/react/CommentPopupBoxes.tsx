import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {CommentPopupBox} from './CommentPopupBox';
import {Elements} from '../../util/Elements';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {CommentEvent} from './CommentEvent';

export class CommentPopupBoxes {

    public static create(commentEventDispatcher: IEventDispatcher<CommentEvent>) {
        const popupElement = CommentPopupBoxes.createPopupElement();
        document.body.appendChild(popupElement);
        CommentPopupBoxes.render(popupElement, commentEventDispatcher);
    }

    public static createPopupElement() {

        const style = `width: 600px; height: 250px;`;

        return Elements.createElementHTML(`<div id="comments-popup" style="${style}"></div>`);

    }

    public static render(target: HTMLElement,
                         commentEventDispatcher: IEventDispatcher<CommentEvent>) {

        ReactDOM.render(
            <CommentPopupBox commentEventDispatcher={commentEventDispatcher}/>,
            target
        );

    }

}

export interface CommentPopup {
    popupElement: HTMLElement;
}
