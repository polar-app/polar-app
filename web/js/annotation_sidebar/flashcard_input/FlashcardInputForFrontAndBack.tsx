import * as React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {FlashcardType} from '../../metadata/FlashcardType';
import {FlashcardButtons} from './FlashcardButtons';
import {FlashcardTypeSelector} from './FlashcardTypeSelector';
import {RichTextArea} from '../RichTextArea';
import {RichTextMutator} from '../../apps/card_creator/elements/schemaform/RichTextMutator';
import {Elements} from '../../util/Elements';
import {FlashcardInputFieldsType, Styles, ClozeFields, FrontAndBackFields} from './FlashcardInput';

const log = Logger.create();

export class FlashcardInputForFrontAndBack extends React.Component<IProps, IState> {

    private readonly flashcardType: FlashcardType = FlashcardType.BASIC_FRONT_BACK;

    private fields: FrontAndBackFields = {front: "", back: ""};

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCreate = this.onCreate.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            iter: 0,
        };

    }

    public render() {

        const { id } = this.props;

        return (

            <div id="annotation-flashcard-box" className="">


                <RichTextArea label="front"
                              id={`front-${this.props.id}`}
                              autofocus={true}
                              onKeyDown={event => this.onKeyDown(event)}
                              onChange={(html) => this.fields.front = html}
                />

                <RichTextArea label="back"
                              id={`back-${this.props.id}`}
                              onKeyDown={event => this.onKeyDown(event)}
                              onChange={(html) => this.fields.back = html}
                />

                {/*- quote annotation ... to copy the annotation text.*/}

                <div style={Styles.BottomBar}>

                    <div style={Styles.BottomBarItem}>

                        <FlashcardTypeSelector
                            flashcardType={this.flashcardType}
                            onChangeFlashcardType={flashcardType => this.props.onFlashcardChangeType(flashcardType)}/>

                    </div>

                    <div style={Styles.BottomBarItemRight}
                         className="text-right">

                        <FlashcardButtons onCancel={() => this.onCancel()}
                                          onCreate={() => this.onCreate()}/>

                    </div>

                </div>

            </div>

        );

    }


    private onKeyDown(event: KeyboardEvent) {

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
        }

    }

    private onCreate(): void {

        if (this.props.onFlashcardCreated) {
            this.props.onFlashcardCreated(this.flashcardType, this.fields);
        }

        this.reset();

        this.setState({
            iter: this.state.iter + 1
        });

    }

    private onCancel(): void {

        if (this.props.onCancel) {
            this.props.onCancel();
        }

        this.reset();

    }

    private reset(): void {
        this.fields = {front: "", back: ""};
    }


}

export interface IProps {
    readonly id: string;
    readonly onFlashcardCreated: (flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>) => void;
    readonly onFlashcardChangeType: (flashcardType: FlashcardType) => void;
    readonly onCancel?: () => void;
}

export interface IState {
    readonly iter: number;
}


