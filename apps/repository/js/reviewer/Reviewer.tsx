import * as React from 'react';
import {Button, Progress} from "reactstrap";
import {AnnotationPreview} from "../annotation_repo/AnnotationPreview";
import {Percentages} from "polar-shared/src/util/Percentages";
import {Answer, Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {
    ReadingTaskAction,
    TaskRep
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Platforms} from "../../../../web/js/util/Platforms";
import {Row} from "../../../../web/js/ui/layout/Row";
import {FlashcardCard} from "./cards/FlashcardCard";
import {FlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {ReadingCard} from "./cards/ReadingCard";

export class Reviewer<A> extends React.Component<IProps<A>, IState<A>> {

    constructor(props: IProps<A>, context: any) {
        super(props, context);

        this.onRating = this.onRating.bind(this);
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

        const {id, action, created, color} = taskRep;

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

        // const Main = () => {
        //
        //     if (typeof action === 'string') {
        //         return <AnnotationPreview id={id}
        //                                   text={action}
        //                                   created={created}
        //                                   meta={{color}}/>
        //     } else {
        //
        //         const flashcardTaskAction: FlashcardTaskAction
        //             = action as any as FlashcardTaskAction;
        //         const front = flashcardTaskAction.front;
        //         const back = flashcardTaskAction.back;
        //         const answers = <div/>;
        //
        //         return <FlashcardCard front={front} back={back} answers={answers}/>
        //     }
        //
        // };

        const DoReadingCard = () => {

            const readingTaskRep = taskRep as any as TaskRep<ReadingTaskAction>;

            return <ReadingCard taskRep={readingTaskRep}
                                onRating={(_, rating) => this.onRating(taskRep, rating)}/>

        };

        const DoFlashcardCard = () => {

            const flashcardTaskRep = taskRep as any as TaskRep<FlashcardTaskAction>;

            const flashcardTaskAction = flashcardTaskRep.action;
            const front = flashcardTaskAction.front;
            const back = flashcardTaskAction.back;

            return <FlashcardCard taskRep={flashcardTaskRep}
                                  front={front}
                                  back={back}
                                  onRating={(_, rating) => this.onRating(taskRep, rating)}/>
        };

        const Card = () => {

            if (typeof action === 'string') {
                return <DoReadingCard/>;

            } else {
                return <DoFlashcardCard/>;
            }

        };

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


                <Card/>

                {/*<div className="p-1"*/}
                {/*     style={{*/}
                {/*        flexGrow: 1,*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'column',*/}
                {/*        overflowY: 'auto'*/}
                {/*     }}>*/}

                {/*    <div style={{*/}
                {/*            flexGrow: 1*/}
                {/*         }}>*/}

                {/*        <Main/>*/}

                {/*    </div>*/}

                {/*</div>*/}

                {/*<div>*/}

                {/*    <div className="text-sm text-grey700 mb-1 ml-1">*/}
                {/*        <b>stage: </b> {taskRep.stage}*/}
                {/*    </div>*/}

                {/*    <div style={{*/}
                {/*            display: 'flex',*/}
                {/*        }}>*/}

                {/*        <RatingButtons taskRep={taskRep}*/}
                {/*                       stage={taskRep.stage}*/}
                {/*                       onRating={this.onRating}/>*/}

                {/*    </div>*/}

                {/*</div>*/}

            </div>

        );

    }

    private onSuspended(taskRep: TaskRep<A>) {
        this.props.onSuspended(taskRep);
        this.doNext();

    }


    private onRating(taskRep: TaskRep<A>, rating: Rating) {
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
export interface RatingCallback<A> {
    (taskRep: TaskRep<A>, rating: Rating): void;
}

export interface IProps<A> {

    readonly taskReps: ReadonlyArray<TaskRep<A>>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly onRating: RatingCallback<A>;

    readonly onSuspended: (taskRep: TaskRep<A>) => void;

    readonly onFinished: FinishedCallback;

}

export interface IState<A> {

    /**
     * The review we're working with or undefined when there are no more.
     */
    readonly taskRep?: TaskRep<A> | undefined;

    readonly pending: TaskRep<A>[];

    readonly finished: number;

    readonly total: number;

}
