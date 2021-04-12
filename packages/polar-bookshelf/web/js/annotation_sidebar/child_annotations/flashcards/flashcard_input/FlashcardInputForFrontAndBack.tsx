import * as React from 'react';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FlashcardButtons} from './FlashcardButtons';
import {FlashcardTypeSelector} from './FlashcardTypeSelector';
import {RichTextArea} from '../../../RichTextArea';
import {
    FlashcardInputFieldsType,
    FlashcardInputs,
    FrontAndBackFields
} from './FlashcardInputs';
import {Flashcard} from '../../../../metadata/Flashcard';
import {InputCompleteListener} from "../../../../mui/complete_listeners/InputCompleteListener";

// TODO: to functional component.
export class FlashcardInputForFrontAndBack extends React.Component<IProps, IState> {

    private readonly flashcardType: FlashcardType = FlashcardType.BASIC_FRONT_BACK;

    private fields: FrontAndBackFields = {front: "", back: ""};

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCreate = this.onCreate.bind(this);

        this.state = {
            iter: 0,
        };

        this.fields = this.toFields();

    }

    public render() {

        const fields = this.toFields();

        return (

            <div id="annotation-flashcard-box" className="m-1">

                <InputCompleteListener type='meta+enter'
                                       onCancel={this.props.onCancel}
                                       onComplete={() => this.onCreate()}>
                    <>

                        <RichTextArea label="front"
                                      id={`front-${this.props.id}`}
                                      value={fields.front}
                                      autofocus={true}
                                      onKeyDown={event => this.onKeyDown(event)}
                                      onChange={(html) => this.fields.front = html}/>

                        <RichTextArea label="back"
                                      id={`back-${this.props.id}`}
                                      value={fields.back}
                                      onKeyDown={event => this.onKeyDown(event)}
                                      onChange={(html) => this.fields.back = html}/>

                    </>

                </InputCompleteListener>

                <div style={{
                        display: 'flex',
                        alignItems: 'center'
                     }}>

                    <div style={{flexGrow: 1}}>

                        <FlashcardTypeSelector
                            flashcardType={this.flashcardType}
                            onChangeFlashcardType={flashcardType => this.props.onFlashcardChangeType(flashcardType)}/>

                    </div>

                    <div>

                        <FlashcardButtons onCancel={this.props.onCancel}
                                          existingFlashcard={this.props.existingFlashcard}
                                          onCreate={() => this.onCreate()}/>

                    </div>

                </div>

            </div>

        );

    }

    private toFields(): FrontAndBackFields {

        const front = FlashcardInputs.fieldToString('front', this.props.existingFlashcard);
        const back = FlashcardInputs.fieldToString('back', this.props.existingFlashcard, this.props.defaultValue);

        return {front, back};

    }

    private onKeyDown(event: KeyboardEvent) {

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
        }

    }

    private onCreate(): void {

        if (this.props.onFlashcard) {
            this.props.onFlashcard(this.flashcardType, this.fields);
        }

        // this.reset();

        this.setState({
            iter: this.state.iter + 1
        });

    }

}

interface IProps {

    readonly id: string;

    readonly onFlashcard: (flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>) => void;

    readonly onFlashcardChangeType: (flashcardType: FlashcardType) => void;

    readonly onCancel: () => void;

    readonly existingFlashcard?: Flashcard;

    readonly defaultValue?: string;
}

interface IState {
    readonly iter: number;
}


