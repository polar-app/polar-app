import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {TaskBody} from "./TaskBody";
import {AnnotationPreview} from "../../annotation_repo/AnnotationPreview";
import {RatingButtons} from "../RatingButtons";
import {ReadingTaskAction} from "./ReadingTaskAction";
import {CardPaper} from "./CardPaper";
import {RatingCallback} from "../RatingCallback";

export interface IProps {
    readonly taskRep: TaskRep<ReadingTaskAction>;
    readonly onRating: RatingCallback<ReadingTaskAction>;
}
export const ReadingCard = (props: IProps) => {

    const taskRep = props.taskRep;
    const {id, action, created, color} = taskRep;

    return (
        <TaskBody taskRep={taskRep}>

            <TaskBody.Main taskRep={taskRep}>

                <CardPaper>
                    <AnnotationPreview id={id}
                                       text={action.docAnnotation.text}
                                       img={action.docAnnotation.img}
                                       lastUpdated={action.docAnnotation.lastUpdated}
                                       created={created}
                                       color={color}/>
                </CardPaper>

            </TaskBody.Main>

            <TaskBody.Footer taskRep={taskRep}>

                <RatingButtons taskRep={taskRep}
                               stage={taskRep.stage}
                               onRating={props.onRating}/>

            </TaskBody.Footer>

        </TaskBody>
    );

}