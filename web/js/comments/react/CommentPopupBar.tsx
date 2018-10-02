import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import PopoverHeader from 'reactstrap/lib/PopoverHeader';
import {CommentInputEvent} from './CommentInputEvent';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {OnCommentHandler} from './CommentPopupBoxes';

export class CommentPopupBar extends React.Component<CommentPopupBarProps, IState> {

    private text: string = "";

    constructor(props: CommentPopupBarProps, context: any) {
        super(props, context);

        this.handleComment = this.handleComment.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);

        this.state = {
        };

        this.props.commentEventDispatcher.addEventListener(commentEvent => {
            this.onCommentEvent(commentEvent);
        });

    }

    private onCommentEvent(commentInputEvent: CommentInputEvent) {

        const point = commentInputEvent.point;

        document.getElementById('comment-anchor')!.style.cssText
            = `position: absolute; top: ${point.y}px; left: ${point.x}px;`;

        this.setState({
            commentInputEvent
        });

    }

    private handleComment() {

        this.props.onComment({
            text: this.text,
            type: 'text',
            annotationDescriptor: this.state.commentInputEvent!.annotationDescriptor,
            pageNum: this.state.commentInputEvent!.pageNum
        });

    }

    private onTextAreaChange(event: React.ChangeEvent) {
        const textArea = event.currentTarget as HTMLTextAreaElement;
        this.text = textArea.value;
    }

    public render() {

        return (

            <div id="comment-popup-box" className="shadow">

                {/*<PopoverHeader>Add Comment</PopoverHeader>*/}

                <PopoverBody>

                    <div>
                        <textarea onChange={this.onTextAreaChange}></textarea>
                    </div>

                    <div>
                        <Button size="sm" color="primary" className="mt-2" onClick={this.handleComment}>
                            Comment
                        </Button>
                    </div>

                </PopoverBody>

            </div>
        );

    }

}

export interface CommentPopupBarCallbacks {
    onComment: OnCommentHandler;
}

export interface CommentPopupBarProps extends CommentPopupBarCallbacks {
    commentEventDispatcher: IEventDispatcher<CommentInputEvent>;
}

interface IState {

    commentInputEvent?: CommentInputEvent;

}
