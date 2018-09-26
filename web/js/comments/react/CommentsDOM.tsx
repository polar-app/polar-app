import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {CommentPopupBox} from './CommentPopupBox';
import {Elements} from '../../util/Elements';

export class CommentsDOM {

    public static createPopupElement() {

        const style = `display: none; background-color: #ffffff; padding: 5px; width: 600px; height: 250px;`;

        return Elements.createElementHTML(`<div id="comments-popup" style="${style}"></div>`);

    }

    public static render(target: HTMLElement) {
        ReactDOM.render(
            <CommentPopupBox />,
            target
        );

    }

}
