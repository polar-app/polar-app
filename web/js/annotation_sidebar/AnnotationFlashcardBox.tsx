import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocAnnotation} from './DocAnnotation';
import {RichTextEditor4} from '../apps/card_creator/elements/schemaform/RichTextEditor4';
import Button from 'reactstrap/lib/Button';
import {RichTextArea} from './RichTextArea';

const log = Logger.create();

export class AnnotationFlashcardBox extends React.Component<IProps, IState> {

    private front: htmlstring = "";
    private back: htmlstring = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onClick = this.onClick.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            iter: 0
        };

    }

    public render() {

        const { annotation } = this.props;

        return (

            <div id="annotation-flashcard-box" className="">

                <RichTextArea label="front"
                              id={`front-${annotation.id}`}
                              autofocus={true}
                              onChange={(html) => this.front = html}/>

                <RichTextArea label="back"
                              id={`back-${annotation.id}`}
                              onChange={(html) => this.back = html}/>

                <div className="text-right">

                    <Button color="primary" size="sm" className="mt-2" onClick={() => this.onClick()}>
                        Create
                    </Button>

                    <Button color="secondary" size="sm" className="mt-2 ml-1" onClick={() => this.onCancel()}>
                        Cancel
                    </Button>

                </div>

            </div>

        );

    }

    private onClick(): void {

        if (this.props.onFlashcardCreated) {
            this.props.onFlashcardCreated(this.front, this.back);
        }

        this.setState({
            iter: this.state.iter + 1
        });

    }

    private onCancel(): void {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

}

export interface IProps {
    annotation: DocAnnotation;
    onFlashcardCreated?: (front: htmlstring, back: htmlstring) => void;
    onCancel?: () => void;
}

export interface IState {
    iter: number;
}

export type htmlstring = string;
