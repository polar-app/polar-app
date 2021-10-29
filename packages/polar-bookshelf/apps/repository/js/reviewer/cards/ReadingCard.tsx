import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {TaskBody} from "./TaskBody";
import {AnnotationPreview} from "../../annotation_repo/AnnotationPreview";
import {RatingButtons} from "../ratings/RatingButtons";
import {CardPaper} from "./CardPaper";
import {DocAnnotationReadingTaskAction} from '../DocAnnotationReviewerTasks';

export interface IProps {
    readonly taskRep: TaskRep<DocAnnotationReadingTaskAction>;
}
export const ReadingCard = (props: IProps) => {

    const taskRep = props.taskRep;
    const {id, action, created, color} = taskRep;

    return (
        <TaskBody taskRep={taskRep}>

            <TaskBody.Main taskRep={taskRep}>

                <CardPaper>
                    <AnnotationPreview id={id}
                                       text={action.original.text}
                                       img={action.original.img}
                                       lastUpdated={action.original.lastUpdated}
                                       created={created}
                                       color={color}/>
                </CardPaper>

            </TaskBody.Main>

            <TaskBody.Footer taskRep={taskRep}>

                <RatingButtons taskRep={taskRep}
                               stage={taskRep.stage}/>

            </TaskBody.Footer>

        </TaskBody>
    );

}