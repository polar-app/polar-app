import * as React from 'react';
import {Button, Progress} from "reactstrap";
import {AnnotationPreview} from "../annotation_repo/AnnotationPreview";
import {IDStr} from "polar-shared/src/util/Strings";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Answer} from "../../../../../polar-app-public/polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Task} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";

export class Reviewer extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onAnswer = this.onAnswer.bind(this);

        const pending = [...this.props.tasks];
        const total = this.props.tasks.length;
        const task = pending.shift();

        this.state = {
            task, pending, total, finished: 0
        };

    }

    public render() {

        const task = this.state.task;

        if (! task) {
            // we're done...
            console.log("No tasks were given");
            return <div/>;
        }

        const {id, text, created, color} = task;

        const perc = Math.floor(Percentages.calculate(this.state.finished, this.state.total));

        const createProgressText = () => {

            if (this.state.finished === 0) {
                return "";
            }

            return `${this.state.finished + 1} of ${this.state.total}`;

        };

        // again, hard, good, easy

        return (

            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '1000px',
                    maxWidth: '800px',
                    background: 'var(--white)'
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


        );

    }

    private onAnswer(id: IDStr, answer: Answer) {

        this.props.onAnswer(id, answer);

        const task = this.state.pending.shift();

        if (! task) {
            this.props.onFinished();
        }

        this.setState({
            ...this.state,
            task,
            finished: this.state.finished + 1
        });

    }

}

export interface IProps {

    readonly tasks: ReadonlyArray<Task>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly onAnswer: (id: IDStr, answer: Answer) => void;

    readonly onFinished: () => void;

}

export interface IState {

    /**
     * The review we're working with or undefined when there are no more.
     */
    readonly task?: Task | undefined;

    readonly pending: Task[];

    readonly finished: number;

    readonly total: number;

}
