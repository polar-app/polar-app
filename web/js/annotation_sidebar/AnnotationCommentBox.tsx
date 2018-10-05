import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocAnnotation} from './DocAnnotation';
import {RichTextEditor4} from '../apps/card_creator/elements/schemaform/RichTextEditor4';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

export class AnnotationCommentBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {

        };

    }

    public render() {
        const { annotation } = this.props;

        const id = 'rich-text-editor-' + annotation.id;

        return (

            <div id="annotation-comment-box" className="">

                <div className="border rounded p-1 annotation-comment-wrapper">
                    <RichTextEditor4 id={id} autofocus={true}/>
                </div>

                <div className="text-right">
                    {/*onClick={this.handleComment}*/}
                    <Button color="primary" className="mt-2">
                        Comment
                    </Button>
                </div>

            </div>

        );
    }

}

export interface IProps {
    annotation: DocAnnotation;
}

export interface IState {
}

