import * as React from 'react';
import {Logger} from '../../../../logger/Logger';
import {FlashcardType} from '../../../../metadata/FlashcardType';
import {FlashcardInputFieldsType} from './FlashcardInputTypes';
import {FlashcardInputForCloze} from './FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from './FlashcardInputForFrontAndBack';

const log = Logger.create();

export class AnnotationFlashcardBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onFlashcardCreated = this.onFlashcardCreated.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            iter: 0,

            // TODO: maybe read this from localStorage so the users prefs
            // are kept
            flashcardType: this.props.flashcardType || this.defaultFlashcardType()
        };

    }

    public render() {

        if (this.state.flashcardType === FlashcardType.BASIC_FRONT_BACK) {

            return ( <FlashcardInputForFrontAndBack id={this.props.id}
                                                    onCancel={() => this.props.onCancel()}
                                                    onFlashcardCreated={(flashcardType, fields) => this.onFlashcardCreated(flashcardType, fields)}
                                                    onFlashcardChangeType={flashcardType => this.onFlashcardChangeType(flashcardType)}/> );

        } else {

            return ( <FlashcardInputForCloze id={this.props.id}
                                             onCancel={() => this.props.onCancel()}
                                             onFlashcardCreated={(flashcardType, fields) => this.onFlashcardCreated(flashcardType, fields)}
                                             onFlashcardChangeType={flashcardType => this.onFlashcardChangeType(flashcardType)}/> );

        }

    }

    private onFlashcardChangeType(flashcardType: FlashcardType) {
        this.setState({...this.state, flashcardType});
        this.setDefaultFlashcardType(flashcardType);
    }

    private defaultFlashcardType() {

        const defaultFlashcardType = window.localStorage.getItem('default-flashcard-type');

        switch (defaultFlashcardType) {

            case FlashcardType.BASIC_FRONT_BACK:
                return FlashcardType.BASIC_FRONT_BACK;

            case FlashcardType.CLOZE:
                return FlashcardType.CLOZE;

            default:
                return FlashcardType.BASIC_FRONT_BACK;
        }

    }

    private setDefaultFlashcardType(flashcardType: FlashcardType) {
        window.localStorage.setItem('default-flashcard-type', flashcardType);
    }

    private onFlashcardCreated(flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>): void {

        this.props.onFlashcardCreated(flashcardType, fields);

        this.setState({
            iter: this.state.iter + 1
        });

    }

    private onCancel(): void {

        this.props.onCancel();

    }

}

export interface IProps {
    readonly id: string;
    readonly flashcardType?: FlashcardType;
    readonly onFlashcardCreated: (flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>) => void;
    readonly onCancel: () => void;
}

export interface IState {
    readonly iter: number;
    readonly flashcardType: FlashcardType;
}
