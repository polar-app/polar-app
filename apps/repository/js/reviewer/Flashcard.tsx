import * as React from 'react';
import {Button} from "reactstrap";

/**
 * Basic flashcard component which allows us to display any type of card as long as it has a front/back design.
 */
export class Flashcard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>

                <div className="p-1"
                     style={{flexGrow: 1}}>

                    <Flashcard.Main {...this.props}/>

                </div>

                <div className="text-center p-1 mt-1">
                    <Flashcard.Buttons {...this.props}/>
                </div>

            </div>

        );

    }

    static Main = class extends React.Component<IProps, IState> {
        public render() {

            switch (this.props.side) {

                case 'front':
                    return this.props.front;

                case 'back':
                    return this.props.back;

            }

        }
    };

    static Buttons = class extends React.Component<IProps, IState> {
        public render() {

            switch (this.props.side) {

                case 'front':
                    return <Button color="primary" onClick={this.props.onShowAnswer}>Show Answer</Button>

                case 'back':
                    return this.props.answers;

            }
        }

    }

}


export type FlashcardSide = 'front' | 'back';

export interface IProps {

    readonly onShowAnswer: () => void;

    readonly front: React.ReactNode;

    readonly back: React.ReactNode;

    readonly side: FlashcardSide;

    readonly answers: React.ReactNode;

}

export interface IState {

}
