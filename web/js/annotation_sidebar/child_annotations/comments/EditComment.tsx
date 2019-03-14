import * as React from 'react';
import {Logger} from '../../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {RichTextArea} from "../../RichTextArea";
import {Comment} from '../../../metadata/Comment';

const log = Logger.create();

export class EditComment extends React.Component<IProps, IState> {

    private html: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onComment = this.onComment.bind(this);

        if (this.props.existingComment) {
            this.html = this.props.existingComment.content.HTML!;
        }

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

                        {this.props.cancelButton}

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

        if (this.props.existingComment) {

            if (this.props.onCommentUpdated) {
                this.props.onCommentUpdated(this.html, this.props.existingComment);
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


}

export interface IProps {

    id: string;

    /**
     * When given a comment we're editing an existing comment.
     */
    existingComment?: Comment;
    onCommentCreated?: (html: string) => void;
    onCommentUpdated?: (html: string, existingComment: Comment) => void;
    cancelButton: JSX.Element;

}

export interface IState {
    iter: number;
}


