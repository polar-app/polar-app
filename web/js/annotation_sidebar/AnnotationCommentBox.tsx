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

        };

    }

    public render() {

        const { annotation } = this.props;

        const id = 'rich-text-editor-' + annotation.id;

        return (

            <div id="annotation-comment-box" className="">

                <div className="border rounded p-1 annotation-comment-wrapper">
                    <RichTextEditor4 id={id} autofocus={true} onChange={(html) => this.onChange(html)}/>
                </div>

                <div className="text-right">
                    {/*onClick={this.handleComment}*/}
                    <Button color="primary" className="mt-2" onClick={() => this.onClick()}>
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

        if (this.props.onComment) {
            this.props.onComment(this.html);
        }

    }

}

export interface IProps {
    annotation: DocAnnotation;
    onComment?: (html: string) => void;
}

export interface IState {
}

