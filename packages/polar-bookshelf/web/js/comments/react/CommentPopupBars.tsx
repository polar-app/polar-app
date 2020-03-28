import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {ControlledPopups} from '../../ui/popup/ControlledPopups';
import * as React from 'react';
import {CommentPopupBar, CommentPopupBarCallbacks} from './CommentPopupBar';
import {CommentInputEvent} from './CommentInputEvent';
import {ControlledPopupProps} from '../../ui/popup/ControlledPopup';

export class CommentPopupBars {

    public static create(controlledPopupProps: ControlledPopupProps,
                         commentPopupBarCallbacks: CommentPopupBarCallbacks): IEventDispatcher<CommentInputEvent> {

        const commentEventDispatcher = new SimpleReactor<CommentInputEvent>();

        const child = <CommentPopupBar commentEventDispatcher={commentEventDispatcher}
                                       onComment={commentPopupBarCallbacks.onComment}/>

        ControlledPopups.create(controlledPopupProps, child);

        return commentEventDispatcher;

    }
}
