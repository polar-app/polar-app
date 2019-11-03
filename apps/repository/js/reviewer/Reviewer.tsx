import * as React from 'react';
import {Button, Progress} from "reactstrap";
import {AnnotationPreview} from "../annotation_repo/AnnotationPreview";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Answer, Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Platforms} from "../../../../web/js/util/Platforms";
import {Row} from "../../../../web/js/ui/layout/Row";
import {RatingButtons} from "./RatingButtons";

export class Reviewer extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onAnswer = this.onAnswer.bind(this);
        this.doNext = this.doNext.bind(this);
        this.onSuspended = this.onSuspended.bind(this);

        const pending = [...this.props.taskReps];
        const total = this.props.taskReps.length;
        const taskRep = pending.shift();

        this.state = {
            taskRep, pending, total, finished: 0
        };

    }

    public render() {

        const taskRep = this.state.taskRep;

        if (! taskRep) {
            // we're done...
            console.log("No tasks were given");
            return <div/>;
        }

        const {id, text, created, color} = taskRep;

        const perc = Math.floor(Percentages.calculate(this.state.finished, this.state.total));

        const createProgressText = () => {

            if (this.state.finished === 0) {
                return "";
            }

            return `${this.state.finished + 1} of ${this.state.total}`;

        };

        // again, hard, good, easy

        const style: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--white)'
        };

        if (Platforms.isMobile()) {
            style.width = '100%';
            style.height = '100%';
        } else {
            style.maxHeight = '1000px';
            style.width = '800px';
            style.maxWidth = '800px';
        }

        return (

            <div style={style}
                 className="ml-auto mr-auto h-100 border p-1">

                <Row>
                    <Row.Main>

                        <b>Review</b>

                    </Row.Main>

                    <Row.Right>

                        <Button size="sm"
                                color="light"
                                className="text-muted mr-1"
                                onClick={() => this.onSuspended(taskRep)}>
                            <i className="fas fa-pause"/> suspend
                        </Button>

                        <Button size="sm"
                                color="light"
                                className="text-muted"
                                onClick={() => this.props.onFinished(true)}>

                            <i className="far fa-times-circle"/>

                        </Button>

                    </Row.Right>

                </Row>

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

                    <RatingButtons taskRep={taskRep} stage={taskRep.stage} onRating={this.props.onRating}/>

                </div>

            </div>


        );

    }

    private onSuspended(taskRep: TaskRep) {
        this.props.onSuspended(taskRep);
        this.doNext();

    }


    private onAnswer(taskRep: TaskRep, rating: Rating) {

        this.props.onRating(taskRep, rating);
        this.doNext();

    }

    private doNext() {

        const taskRep = this.state.pending.shift();

        if (! taskRep) {
            this.props.onFinished();
        }

        this.setState({
            ...this.state,
            taskRep,
            finished: this.state.finished + 1
        });

    }

}

/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type FinishedCallback = (cancelled?: boolean) => void;


/**
 * Called when we're finished all the tasks.
 *
 * @param cancelled true if the user explicitly cancelled the review.
 */
export type RatingCallback = (taskRep: TaskRep, rating: Rating) => void;

export interface IProps {

    readonly taskReps: ReadonlyArray<TaskRep>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly onRating: RatingCallback;

    readonly onSuspended: (taskRep: TaskRep) => void;

    readonly onFinished: FinishedCallback;

}

export interface IState {

    /**
     * The review we're working with or undefined when there are no more.
     */
    readonly taskRep?: TaskRep | undefined;

    readonly pending: TaskRep[];

    readonly finished: number;

    readonly total: number;

}
