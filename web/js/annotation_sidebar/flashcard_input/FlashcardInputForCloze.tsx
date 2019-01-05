import * as React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {FlashcardType} from '../../metadata/FlashcardType';
import {FlashcardButtons} from './FlashcardButtons';
import {FlashcardTypeSelector} from './FlashcardTypeSelector';
import {RichTextArea} from '../RichTextArea';
import {RichTextMutator} from '../../apps/card_creator/elements/schemaform/RichTextMutator';
import {Elements} from '../../util/Elements';
import {FlashcardInputFieldsType, Styles, ClozeFields} from './FlashcardInput';
import {UncontrolledTooltip} from 'reactstrap';

const log = Logger.create();

export class FlashcardInputForCloze extends React.Component<IProps, IState> {

    private readonly flashcardType: FlashcardType = FlashcardType.CLOZE;

    private fields: ClozeFields = {text: ""};

    private richTextMutator?: RichTextMutator;

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

                <RichTextArea id={`text-${this.props.id}`}
                              autofocus={true}
                              onKeyDown={event => this.onKeyDown(event)}
                              onRichTextMutator={richTextMutator => this.richTextMutator = richTextMutator}
                              onChange={(html) => this.fields.text = html}/>

                {/*- quote annotation ... to copy the annotation text.*/}

                <div style={Styles.BottomBar}>

                    <div style={Styles.BottomBarItem}>

                        <FlashcardTypeSelector
                            flashcardType={this.flashcardType}
                            onChangeFlashcardType={flashcardType => this.props.onFlashcardChangeType(flashcardType)}/>

                    </div>

                    <div style={Styles.BottomBarItem} className="ml-1">

                        <Button id={`button-${this.props.id}`}
                                color="light"
                                size="sm"
                                onClick={() => this.onClozeDelete()}
                                className="ml-1 p-1 border">[…]</Button>

                        <UncontrolledTooltip placement="auto"
                                             delay={{show: 750, hide: 0}}
                                             target={`button-${this.props.id}`}>
                            Create cloze deletion for text <span className="text-muted">Control+Shift+C</span>
                        </UncontrolledTooltip>

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

    private onClozeDelete(): void {

        // TODO: don't use the top level window but get it from the proper
        // event
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);

        const wrapper = document.createElement('span');
        range.surroundContents(wrapper);

        const prefix = Elements.createElementHTML('{{c1:', 'span');
        const suffix = Elements.createElementHTML('}}', 'span');

        wrapper.parentNode!.insertBefore(prefix, wrapper);
        wrapper.parentNode!.insertBefore(suffix, wrapper.nextSibling);

        sel.removeAllRanges();

        this.fields.text = this.richTextMutator!.currentValue();


    }

    private onKeyDown(event: KeyboardEvent) {

        if (this.isKeyboardControlShiftC(event)) {
            this.onClozeDelete();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
        }

    }

    private isKeyboardControlShiftC(event: KeyboardEvent) {

        return event.getModifierState("Control") &&
               event.getModifierState("Shift") &&
               event.key === "C";
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
        this.fields = {text: ""};
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


