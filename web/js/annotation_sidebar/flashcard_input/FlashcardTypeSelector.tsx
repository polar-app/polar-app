import * as React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {FlashcardType} from '../../metadata/FlashcardType';
import Input from 'reactstrap/lib/Input';
import {FlashcardFields} from './FlashcardFields';
import {FlashcardButtons} from './FlashcardButtons';

const log = Logger.create();

class Styles {

    public static SelectCardType: React.CSSProperties = {
        minWidth: '10em',
        fontSize: '14px'
    };

}

export class FlashcardTypeSelector extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <Input type="select"
                   style={Styles.SelectCardType}
                   className="p-0"
                   onChange={htmlInputElement => this.props.onChangeFlashcardType(htmlInputElement.target.value as FlashcardType)}>

                <option value={FlashcardType.BASIC_FRONT_BACK}
                        selected={this.props.flashcardType === FlashcardType.BASIC_FRONT_BACK}>Front and back</option>

                <option value={FlashcardType.CLOZE}
                        selected={this.props.flashcardType === FlashcardType.CLOZE}>Cloze</option>

            </Input>

        );

    }

}

export interface IProps {
    readonly flashcardType: FlashcardType;
    readonly onChangeFlashcardType: (flashcardType: FlashcardType) => void;
}

export interface IState {
}
