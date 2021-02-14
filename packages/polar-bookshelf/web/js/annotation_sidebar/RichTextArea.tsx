import * as React from 'react';
import {RichTextEditor4} from '../apps/card_creator/elements/schemaform/RichTextEditor4';
import {RichTextMutator} from '../apps/card_creator/elements/schemaform/RichTextMutator';
import {HTMLStr} from "polar-shared/src/util/Strings";

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

        const Label = () => {

            if (this.props.label) {
                return (<div>{label}</div>);
            } else {
                return ( <div></div> );
            }

        };

        return (

            <div id={this.props.id} className="rich-text-area">

                <div>

                    <Label/>

                    <div className="border rounded mb-1 rich-text-area-input">

                        <RichTextEditor4 id={`rich-text-area-${this.props.id}`}
                                         value={this.props.value || ''}
                                         defaultValue={this.props.defaultValue}
                                         autofocus={autofocus}
                                         onKeyDown={this.props.onKeyDown}
                                         onRichTextMutator={this.props.onRichTextMutator}
                                         onChange={(html) => this.props.onChange(html)}/>

                    </div>

                </div>

            </div>

        );

    }

}

interface IProps {
    readonly id: string;
    readonly value?: string;
    readonly defaultValue?: string;
    readonly label?: string;
    readonly autofocus?: boolean;
    readonly onChange: (html: HTMLStr) => void;
    readonly onKeyDown?: (event: KeyboardEvent) => void;
    readonly onRichTextMutator?: (mutator: RichTextMutator) => void;
}

interface IState {
}
