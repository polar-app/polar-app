import * as React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {FlashcardType} from '../../metadata/FlashcardType';
import Input from 'reactstrap/lib/Input';
import {FlashcardFields} from './FlashcardFields';
import {FlashcardButtons} from './FlashcardButtons';
import {FlashcardTypeSelector} from './FlashcardTypeSelector';
import {FlashcardInputFieldsType, FrontAndBackFields, ClozeFields} from './FlashcardInput';

const log = Logger.create();

class Styles {

    public static BottomBar: React.CSSProperties = {
        display: 'flex'
    };

    public static BottomBarItem: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
    };

    public static BottomBarItemRight: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '100%'
    };

}

export class AnnotationFlashcardBox extends React.Component<IProps, IState> {

    private fields: FlashcardInputFieldsType;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCreate = this.onCreate.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            iter: 0,

            // TODO: maybe read this from localStorage so the users prefs
            // are kept
            type: this.props.type || FlashcardType.BASIC_FRONT_BACK
        };

        this.fields = this.createFields(this.state.type);

    }

    public render() {

        const { id } = this.props;

        return (

            <div id="annotation-flashcard-box" className="">

                <FlashcardFields type={this.state.type}
                                 id={this.props.id}
                                 fields={this.fields}
                                 onKeyDown={event => this.onKeyDown(event)}/>

                {/*FIXME: put the following buttons on the bottom of the flashcard:*/}

                {/*- close delete button to cloze delete a region of text*/}

                {/*- quote annotation ... to copy the annotation text.*/}

                <div style={Styles.BottomBar}>

                    <div style={Styles.BottomBarItem}>

                        <FlashcardTypeSelector
                            flashcardType={this.state.type}
                            onChangeFlashcardType={flashcardType => this.onChangeType(flashcardType)}/>

                    </div>

                    <div style={Styles.BottomBarItem} className="ml-1">

                        <Button color="light"
                                size="sm"
                                className="ml-1 p-1 border">[…]</Button>

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

    private isClozeKeyboardEvent(event: KeyboardEvent) {

        return event.getModifierState("Control") &&
               event.getModifierState("Shift") &&
               event.key === "C";
    }

    private onChangeType(type: FlashcardType) {
        this.fields = this.createFields(type);
        this.setState({...this.state, type});
    }

    private onCreate(): void {

        if (this.props.onFlashcardCreated) {
            this.props.onFlashcardCreated(this.state.type, this.fields);
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
        this.fields = this.createFields(this.state.type);
    }

    private createFields(type: FlashcardType): FlashcardInputFieldsType {

        if (type === FlashcardType.BASIC_FRONT_BACK) {
            const result: FrontAndBackFields = {front: "", back: ""};
            return result;
        } else {
            const result: ClozeFields = {text: ""};
            return result;
        }

    }

}

export interface IProps {
    readonly id: string;
    readonly type?: FlashcardType;
    readonly onFlashcardCreated?: (type: FlashcardType, fields: Readonly<FlashcardInputFieldsType>) => void;
    readonly onCancel?: () => void;
}

export interface IState {
    readonly iter: number;
    readonly type: FlashcardType;
}
