import * as React from 'react';
import {
    ReadingTaskAction,
    TaskRep
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {CardBody} from "./CardBody";
import {AnnotationPreview} from "../../annotation_repo/AnnotationPreview";
import {RatingButtons} from "../RatingButtons";
import {RatingCallback} from "../Reviewer";

export class ReadingCard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const taskRep = this.props.taskRep;
        const {id, action, created, color} = taskRep;

        return <CardBody taskRep={taskRep}>

            <CardBody.Main taskRep={taskRep}>

                <AnnotationPreview id={id}
                                   text={action}
                                   created={created}
                                   meta={{color}}/>

            </CardBody.Main>

            <CardBody.Footer taskRep={taskRep}>

                <RatingButtons taskRep={taskRep}
                               stage={taskRep.stage}
                               onRating={this.props.onRating}/>

            </CardBody.Footer>

        </CardBody>;

    }

}

export interface IProps {
    readonly taskRep: TaskRep<ReadingTaskAction>;
    readonly onRating: RatingCallback<ReadingTaskAction>;
}

export interface IState {
}
