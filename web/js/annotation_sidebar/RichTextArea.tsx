import * as React from 'react';
import {Logger} from '../logger/Logger';
import {DocAnnotation} from './DocAnnotation';
import {RichTextEditor4} from '../apps/card_creator/elements/schemaform/RichTextEditor4';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

export class RichTextArea extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const autofocus = this.props.autofocus !== undefined ? this.props.autofocus : false;

        let label: JSX.Element | undefined = <label className="text-muted">{this.props.label}</label>;

        if (this.props.label === undefined) {
            label = undefined;
        }

        return (

            <div id={this.props.id} className="rich-text-area">

                <div>

                    {label}

                    <div className="border rounded p-1 mb-1 rich-text-area-input">

                        <RichTextEditor4 id={`rich-text-area-${this.props.id}`}
                                         value={this.props.value || ''}
                                         autofocus={autofocus}
                                         onKeyDown={this.props.onKeyDown}
                                         onChange={(html) => this.props.onChange(html)}/>

                    </div>

                </div>

            </div>

        );

    }

}

export interface IProps {
    id: string;
    value?: string;
    label?: string;
    autofocus?: boolean;
    onChange: (html: htmlstring) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
}

export interface IState {
}

export type htmlstring = string;
