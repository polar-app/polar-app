import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocAnnotation} from './DocAnnotation';
import {RichTextEditor4} from '../apps/card_creator/elements/schemaform/RichTextEditor4';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

export class AnnotationCommentBox extends React.Component<IProps, IState> {

    private html: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onClick = this.onClick.bind(this);

        this.state = {
            iter: 0
        };

    }

    public render() {

        const { annotation } = this.props;

        const id = 'rich-text-editor-' + annotation.id;

        return (

            <div id="annotation-comment-box" className="">

                <div className="border rounded p-1 annotation-comment-wrapper">

                    <RichTextEditor4 id={id}
                                     value={this.html}
                                     autofocus={true}
                                     onChange={(html) => this.onChange(html)}/>

                </div>

                <div className="text-right">

                    {/*onClick={this.handleComment}*/}

                    <Button color="primary" size="sm" className="mt-2" onClick={() => this.onClick()}>
                        Comment
                    </Button>

                </div>

            </div>

        );

    }

    private onChange(html: string): void {
        this.html = html;
    }

    private onClick(): void {

        if(this.props.comment) {

            if (this.props.onCommentChanged) {
                this.props.onCommentChanged(this.html);
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
    annotation: DocAnnotation;

    /**
     * When given a comment we're editing an existing comment.
     */
    comment?: Comment;
    onCommentCreated?: (html: string) => void;
    onCommentChanged?: (html: string) => void;
}

export interface IState {
    iter: number;
}

