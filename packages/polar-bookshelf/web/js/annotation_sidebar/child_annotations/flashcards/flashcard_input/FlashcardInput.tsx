import * as React from 'react';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FlashcardInputFieldsType} from './FlashcardInputs';
import {FlashcardInputForCloze} from './FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from './FlashcardInputForFrontAndBack';
import {Flashcard} from '../../../../metadata/Flashcard';

export interface IProps {

    readonly id: string;

    /**
     * The default value to show in the flashcard
     */
    readonly defaultValue?: string;

    readonly flashcardType?: FlashcardType;

    readonly onFlashcard: FlashcardCallback;

    readonly onCancel: () => void;

    readonly existingFlashcard?: Flashcard;

}

export interface IState {
    readonly iter: number;
    readonly flashcardType: FlashcardType;
}

export type FlashcardCallback = (flashcardType: FlashcardType,
                                 fields: Readonly<FlashcardInputFieldsType>,
                                 existingFlashcard?: Flashcard) => void;

export class FlashcardInput extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onFlashcard = this.onFlashcard.bind(this);

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
                                                    onCancel={this.props.onCancel}
                                                    existingFlashcard={this.props.existingFlashcard}
                                                    defaultValue={this.props.defaultValue}
                                                    onFlashcard={(flashcardType, fields) => this.onFlashcard(flashcardType, fields)}
                                                    onFlashcardChangeType={flashcardType => this.onFlashcardChangeType(flashcardType)}/> );

        } else {

            return ( <FlashcardInputForCloze id={this.props.id}
                                             onCancel={this.props.onCancel}
                                             existingFlashcard={this.props.existingFlashcard}
                                             defaultValue={this.props.defaultValue}
                                             onFlashcard={(flashcardType, fields) => this.onFlashcard(flashcardType, fields)}
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
        localStorage.setItem('default-flashcard-type', flashcardType);
    }

    private onFlashcard(flashcardType: FlashcardType,
                        fields: Readonly<FlashcardInputFieldsType>): void {

        this.props.onFlashcard(flashcardType, fields, this.props.existingFlashcard);

        this.setState({
            iter: this.state.iter + 1
        });

    }

}

