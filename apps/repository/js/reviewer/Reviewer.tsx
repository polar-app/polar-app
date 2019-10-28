import * as React from 'react';
import {Button} from "reactstrap";
import {AnnotationPreview} from "../annotation_repo/AnnotationPreview";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Answer} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/S2Plus";
import {IDStr} from "polar-shared/src/util/Strings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {Percentages} from "polar-shared/src/util/Percentages";

export class Reviewer extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onAnswer = this.onAnswer.bind(this);

        const pending = [...this.props.reviews];
        const total = this.props.reviews.length;
        const review = pending.pop()!;

        this.state = {
            review, pending, total, finished: 0
        };

    }

    public render() {

        const {id, text, created, color} = this.state.review;

        const perc = Percentages.calculate(this.state.finished, this.state.total);

        return (

            <div>

                <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                     }}>

                    <div>
                        {/*P<Progress bar value={50} color="success" className="w-100"/>*/}
                        
                        <progress value={perc} className="w-100"/>

                    </div>

                    <div className="p-1"
                         style={{
                            flexGrow: 1
                         }}>

                        <AnnotationPreview id={id}
                                           text={text}
                                           created={created}
                                           meta={{color}}
                        />

                        <div className="text-center">

                            <Button color="danger"
                                    className="m-1"
                                    onClick={() => this.onAnswer(id, 0.0)}>Again</Button>

                            <Button color="secondary"
                                    className="m-1"
                                    onClick={() => this.onAnswer(id, 0.5)}>Good</Button>

                            <Button color="success"
                                    className="m-1"
                                    onClick={() => this.onAnswer(id, 1.0)}>Easy</Button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    private onAnswer(id: IDStr, answer: Answer) {

        this.props.onAnswer(id, answer);

        if (this.state.pending.length === 0) {
            this.props.onFinished();
            return;
        }

        const review = this.state.pending.pop()!;

        this.setState({
            ...this.state,
            review,
            finished: this.state.finished + 1
        });

    }

}

export interface IProps {

    readonly reviews: ReadonlyArray<Review>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly onAnswer: (id: IDStr, answer: Answer) => void;

    readonly onFinished: () => void;

}

export interface IState {

    readonly review: Review;

    readonly pending: Review[];

    readonly finished: number;

    readonly total: number;

}

export interface Review {

    readonly id: IDStr;

    readonly text: string;

    readonly created: ISODateTimeString;

    readonly color: HighlightColor;

}
