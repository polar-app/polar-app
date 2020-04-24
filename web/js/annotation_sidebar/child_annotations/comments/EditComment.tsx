import * as React from 'react';
import {RichTextArea} from "../../RichTextArea";
import {Comment} from '../../../metadata/Comment';
import {RichTextFeatureIntro} from '../../RichTextFeatureIntro';
import Button from '@material-ui/core/Button';

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
            <div>

                <RichTextFeatureIntro/>

                <div id="annotation-comment-box"
                     className="mt-1">

                    <div className="">

                        <RichTextArea id={id}
                                      value={this.html}
                                      autofocus={true}
                                      onKeyDown={event => this.onKeyDown(event)}
                                      onChange={(html) => this.onChange(html)}/>

                    </div>

                    <div className="p-1">

                        <div className="text-right">

                            {this.props.cancelButton}

                            <Button color="primary"
                                    variant="contained"
                                    onClick={() => this.onComment()}>

                                {this.props.existingComment ? 'Update' : 'Comment'}

                            </Button>

                        </div>

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

        this.props.onComment(this.html, this.props.existingComment);

        this.setState({
            iter: this.state.iter + 1
        });

    }

}

interface IProps {

    readonly id: string;

    /**
     * When given a comment we're editing an existing comment.
     */
    readonly existingComment?: Comment;

    /**
     * Called when we have a created or updated an existing comment.  If the
     * 'existingComment' is specified when we're doing an update.
     */
    readonly onComment: (html: string, existingComment?: Comment) => void;

    /**
     *
     */
    readonly cancelButton: JSX.Element;

}

interface IState {
    readonly iter: number;
}


