import * as React from 'react';
import {Percentages} from "polar-shared/src/util/Percentages";
import {Rating} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {FlashcardCard} from "./cards/FlashcardCard";
import {FlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {ReadingCard} from "./cards/ReadingCard";
import {ReadingTaskAction} from "./cards/ReadingTaskAction";
import {ReviewFinished} from "./ReviewFinished";
import {ReviewerDialog} from "./ReviewerDialog";
import LinearProgress from "@material-ui/core/LinearProgress";

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

            return (
                <ReviewerDialog>
                    <ReviewFinished/>
                </ReviewerDialog>
            );

        }

        const perc = Math.floor(Percentages.calculate(this.state.finished, this.state.total));

        const createProgressText = () => {

            if (this.state.finished === 0) {
                return "";
            }

            return `${this.state.finished + 1} of ${this.state.total}`;

        };

        const DoReadingCard = () => {

            const readingTaskRep = taskRep as any as TaskRep<ReadingTaskAction>;

            return <ReadingCard taskRep={readingTaskRep}
                                onRating={(_, rating) => this.onRating(taskRep, rating)}/>;

        };

        const DoFlashcardCard = () => {

            const flashcardTaskRep = taskRep as any as TaskRep<FlashcardTaskAction>;

            const flashcardTaskAction = flashcardTaskRep.action;
            const front = flashcardTaskAction.front;
            const back = flashcardTaskAction.back;

            return <FlashcardCard taskRep={flashcardTaskRep}
                                  front={front}
                                  back={back}
                                  onRating={(_, rating) => this.onRating(taskRep, rating)}/>;
        };

        const Card = () => {

            if (this.state.taskRep!.mode === 'reading') {
                return <DoReadingCard/>;
            } else {
                return <DoFlashcardCard/>;
            }

        };

        return (

            <ReviewerDialog className="reviewer"
                            onSuspended={() => this.onSuspended(taskRep)}>

                {/*<Row>*/}
                {/*    <Row.Main>*/}

                {/*        <b>Review</b>*/}

                {/*    </Row.Main>*/}

                {/*    <Row.Right>*/}

                {/*        <Button onClick={() => this.onSuspended(taskRep)}>*/}
                {/*            <i className="fas fa-pause"/> suspend*/}
                {/*        </Button>*/}

                {/*        <Link to={{pathname: '/annotations'}}>*/}
                {/*            <Button onClick={() => this.props.onFinished(true)}>*/}

                {/*                <i className="fas fa-times"/>*/}

                {/*            </Button>*/}
                {/*        </Link>*/}

                {/*    </Row.Right>*/}

                {/*</Row>*/}

                <div className="mb-1">

                    <LinearProgress variant="determinate"
                                    color="primary"
                                    value={perc}/>

                </div>

                <Card/>

            </ReviewerDialog>

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
export type RatingCallback<A> = (taskRep: TaskRep<A>, rating: Rating) => void;

export type SuspendedCallback<A> = (taskRep: TaskRep<A>) => void;

export interface IProps<A> {

    readonly taskReps: ReadonlyArray<TaskRep<A>>;

    /**
     * Callback for when we receive answers and their values.
     */
    readonly onRating: RatingCallback<A>;

    readonly onSuspended: SuspendedCallback<A>;

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
