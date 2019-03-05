import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocAnnotation} from './DocAnnotation';
import {RichTextEditor4} from '../apps/card_creator/elements/schemaform/RichTextEditor4';
import Button from 'reactstrap/lib/Button';
import {RichTextArea} from "./RichTextArea";

const log = Logger.create();

export class AnnotationCommentBox extends React.Component<IProps, IState> {

    private html: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onComment = this.onComment.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            iter: 0
        };

    }

    public render() {

        const id = 'rich-text-editor-' + this.props.id;

        return (

            <div id="annotation-comment-box" className="">

                <div className="">

                    <RichTextArea id={id}
                                  value={this.html}
                                  autofocus={true}
                                  onKeyDown={event => this.onKeyDown(event)}
                                  onChange={(html) => this.onChange(html)}/>

                </div>

                <div className="flexbar w-100">

                    {/*<div className="text-muted m-1 p-1">*/}

                        {/*<i className="fab fa-html5" style={{fontSize: '20px'}}></i>*/}
                        {/*&nbsp;*/}
                        {/*HTML styling supported*/}

                    {/*</div>*/}

                    <div className="flexbar-right">

                        {/*onClick={this.handleComment}*/}

                        <Button color="secondary"
                                size="sm"
                                className="mt-2 mr-1"
                                onClick={() => this.onCancel()}>
                            Cancel
                        </Button>

                        <Button color="primary"
                                size="sm"
                                className="mt-2"
                                onClick={() => this.onComment()}>
                            Comment
                        </Button>

                    </div>


                </div>

            </div>

        );

    }

    private onKeyDown(event: KeyboardEvent) {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onComment();
        }

    }

    private onChange(html: string): void {
        this.html = html;
    }

    private onComment(): void {

        if (this.props.comment) {

            if (this.props.onCommentChanged) {
                this.props.onCommentChanged(this.html, this.props.comment);
            }

        } else {

            if (this.props.onCommentCreated) {
                this.props.onCommentCreated(this.html);
            }

        }

        this.setState({
            iter: this.state.iter + 1
        });

    }

    private onCancel(): void {

        this.html = "";

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

}

export interface IProps {
    id: string;

    /**
     * When given a comment we're editing an existing comment.
     */
    comment?: Comment;
    onCommentCreated?: (html: string) => void;
    onCommentChanged?: (html: string, comment: Comment) => void;
    onCancel?: () => void;
}

export interface IState {
    iter: number;
}

