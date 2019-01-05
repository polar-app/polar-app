import * as React from 'react';
import {Logger} from '../../logger/Logger';
import {FlashcardType} from '../../metadata/FlashcardType';
import {FlashcardFrontAndBackFields} from './FlashcardFrontAndBackFields';
import {FlashcardClozeFields} from './FlashcardClozeFields';
import {FrontAndBackFields, ClozeFields, FlashcardInputFieldsType} from './FlashcardInput';

const log = Logger.create();

class Styles {

}

export class FlashcardFields extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        if (this.props.type === FlashcardType.BASIC_FRONT_BACK) {

            return ( <FlashcardFrontAndBackFields id={this.props.id}
                                                  onKeyDown={this.props.onKeyDown}
                                                  fields={this.props.fields as FrontAndBackFields}/> );

        } else {

            return ( <FlashcardClozeFields id={this.props.id}
                                           onKeyDown={this.props.onKeyDown}
                                           fields={this.props.fields as ClozeFields}/> );

        }

    }

}

export interface IProps {
    readonly type: FlashcardType;
    readonly id: string;
    readonly fields: FlashcardInputFieldsType;
    readonly onKeyDown: (event: KeyboardEvent) => void;
}

export interface IState {
}



