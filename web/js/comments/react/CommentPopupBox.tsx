import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import PopoverHeader from 'reactstrap/lib/PopoverHeader';
import {CommentInputEvent} from './CommentInputEvent';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {OnCommentHandler} from './CommentPopupBoxes';

export class CommentPopupBox extends React.Component<IProps, IState> {

    private text: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);

        this.state = {
            popoverOpen: false
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
            popoverOpen: true,
            commentInputEvent
        });

    }

    private toggle() {

        this.setState({
            popoverOpen: !this.state.popoverOpen
        });

    }

    private handleComment() {

        console.log("Got a comment: ", this.text);

        this.props.onComment({
            text: this.text,
            type: 'text',
            annotationDescriptor: this.state.commentInputEvent!.annotationDescriptor,
            pageNum: this.state.commentInputEvent!.pageNum
        });

        this.setState({
            popoverOpen: false
        });

    }

    private onTextAreaChange(event: React.ChangeEvent) {
        const textArea = event.currentTarget as HTMLTextAreaElement;
        this.text = textArea.value;
    }

    public render() {

        // TODO:
        //
        // - the box is absolutely positioned so when we scroll the positioning
        //   is lost.
        //
        // - we don't actually update the comment now.

        return (

            <div id="comment-popup-box">

                <div id="comment-anchor"></div>

                {/*<Button id="comment-anchor" onClick={this.toggle}>*/}
                    {/*Launch Popover*/}
                {/*</Button>*/}

                <Popover placement="bottom"
                         id="comment-popup-box-popover"
                         isOpen={this.state.popoverOpen}
                         target="comment-anchor"
                         toggle={this.toggle}
                         style={{width: '650px'}}>
                    <PopoverHeader>Add Comment</PopoverHeader>
                    <PopoverBody>

                        {/*<div className="border rounded p-1">*/}
                            {/*<ReactSummernote4 className="w-100"*/}

                            {/*value=""*/}
                            {/*options={{*/}
                                {/*id: 'my-summernote',*/}
                                {/*lang: 'en-US',*/}
                                {/*height: 400,*/}
                                {/*placeholder: "Enter your comment.",*/}
                                {/*dialogsInBody: false,*/}
                                {/*airMode: true,*/}
                                {/*// toolbar: [*/}
                                {/*//     ['style', []],*/}
                                {/*//     ['font', []],*/}
                                {/*//     ['fontname', []],*/}
                                {/*//     ['para', []],*/}
                                {/*//     ['table', []],*/}
                                {/*//     ['insert', []],*/}
                                {/*//     ['view', []],*/}
                                {/*//     ['image', []]*/}
                                {/*// ]*/}

                                {/*// FIXME: add blockquote, code, and pre, and cite*/}

                                {/*// missing the highlight color pulldown...*/}

                                {/*toolbar: [*/}
                                    {/*['style', ['style']],*/}
                                    {/*['font', ['bold', 'italic', 'underline', 'clear', 'color', 'superscript', 'subscript']],*/}
                                    {/*// ['fontname', ['fontname']],*/}
                                    {/*['para', ['ul', 'ol', 'paragraph']],*/}
                                    {/*['table', ['table']],*/}
                                    {/*['insert', ['link', 'picture', 'video']],*/}
                                    {/*['view', []]*/}
                                {/*]*/}

                            {/*}}*/}
                        {/*/>*/}
                        {/*</div>*/}

                        <div>
                            <textarea onChange={this.onTextAreaChange}></textarea>
                        </div>

                        <div>
                            <Button size="sm" color="primary" className="mt-2" onClick={this.handleComment}>
                                Comment
                            </Button>
                        </div>

                    </PopoverBody>

                </Popover>

            </div>
            // <div className="border rounded p-2 shadow">
            //
            //
            //
            //     <textarea placeholder="Enter a comment"
            //               className="w-100">
            //
            //     </textarea>
            //
            //     <Button size="sm" color="primary" className="mt-2">Add Comment</Button>
            //
            // </div>
        );
    }


}

interface IProps {
    commentEventDispatcher: IEventDispatcher<CommentInputEvent>;
    onComment: OnCommentHandler;
}

interface IState {

    popoverOpen: boolean;

    commentInputEvent?: CommentInputEvent;

}
