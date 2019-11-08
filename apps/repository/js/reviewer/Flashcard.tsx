import * as React from 'react';
import {Button} from "reactstrap";

/**
 * Basic flashcard component which allows us to display any type of card as long as it has a front/back design.
 */
export class Flashcard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onShowAnswer = this.onShowAnswer.bind(this);

        this.state = {
            side: 'front'
        }

    }

    public render() {

        const Main = () => {

            switch (this.state.side) {

                case 'front':
                    return this.props.front;

                case 'back':
                    return this.props.back;

            }

        };

        const Buttons = () => {
            switch (this.state.side) {

                case 'front':
                    return <Button color="primary"
                                   onClick={() => this.onShowAnswer()}>
                        Show Answer
                    </Button>;

                case 'back':
                    return this.props.answers;

            }
        };

        return (

            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                }}>

                <div className="p-1"
                     style={{flexGrow: 1}}>

                    <Main/>

                </div>

                <div className="text-center p-1 mt-1">
                    <Buttons/>
                </div>

            </div>

        );

    }

    private onShowAnswer() {
        this.setState({side: 'back'});
    }

}


export type FlashcardSide = 'front' | 'back';

export interface IProps {

    readonly front: React.ReactElement<any>;

    readonly back: React.ReactElement<any>;

    readonly answers: React.ReactElement<any>;

}

export interface IState {
    readonly side: FlashcardSide;
}
