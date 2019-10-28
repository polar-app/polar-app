import * as React from 'react';
import {Button, Progress} from "reactstrap";
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
        const review = pending.shift()!;

        this.state = {
            review, pending, total, finished: 0
        };

    }

    public render() {

        const {id, text, created, color} = this.state.review;

        const perc = Math.floor(Percentages.calculate(this.state.finished, this.state.total));

        const createProgressText = () => {

            if (this.state.finished === 0) {
                return "";
            }

            return `${this.state.finished + 1} of ${this.state.total}`;

        };

        // again, hard, good, easy

        return (

            <div>

                <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '1000px',
                        maxWidth: '800px'
                     }}
                     className="ml-auto mr-auto h-100 border p-1">

                    <div className="pt-1 pb-1">

                        <Progress value={perc}>{createProgressText()}</Progress>

                    </div>

                    <div className="p-1"
                         style={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto'
                         }}>

                        <div style={{
                                flexGrow: 1
                             }}>

                            <AnnotationPreview id={id}
                                               text={text}
                                               created={created}
                                               meta={{color}}/>

                        </div>

                    </div>

                    <div className="text-center"
                         style={{
                             display: 'flex',
                         }}>

                        <Button color="danger"
                                className="m-1"
                                style={{flexGrow: 1}}
                                onClick={() => this.onAnswer(id, 0.0)}>Again</Button>

                        <Button color="secondary"
                                className="m-1"
                                style={{flexGrow: 1}}
                                onClick={() => this.onAnswer(id, 0.5)}>Good</Button>

                        <Button color="success"
                                className="m-1"
                                style={{flexGrow: 1}}
                                onClick={() => this.onAnswer(id, 1.0)}>Easy</Button>

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

        const review = this.state.pending.shift()!;

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
