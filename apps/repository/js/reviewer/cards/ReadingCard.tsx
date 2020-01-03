import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {TaskBody} from "./TaskBody";
import {AnnotationPreview} from "../../annotation_repo/AnnotationPreview";
import {RatingButtons} from "../RatingButtons";
import {RatingCallback} from "../Reviewer";
import {ReadingTaskAction} from "./ReadingTaskAction";

export class ReadingCard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const taskRep = this.props.taskRep;
        const {id, action, created, color} = taskRep;

        return <TaskBody taskRep={taskRep}>

            <TaskBody.Main taskRep={taskRep}>

                <AnnotationPreview id={id}
                                   text={action.text}
                                   created={created}
                                   color={color}/>

            </TaskBody.Main>

            <TaskBody.Footer taskRep={taskRep}>

                <RatingButtons taskRep={taskRep}
                               stage={taskRep.stage}
                               onRating={this.props.onRating}/>

            </TaskBody.Footer>

        </TaskBody>;

    }

}

export interface IProps {
    readonly taskRep: TaskRep<ReadingTaskAction>;
    readonly onRating: RatingCallback<ReadingTaskAction>;
}

export interface IState {
}
