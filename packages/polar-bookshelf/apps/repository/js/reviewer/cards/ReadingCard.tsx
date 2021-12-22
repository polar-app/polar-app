import * as React from 'react';
import {TaskBody} from "./TaskBody";
import {AnnotationPreview} from "../../annotation_repo/AnnotationPreview";
import {RatingButtons} from "../ratings/RatingButtons";
import {CardPaper} from "./CardPaper";
import {IReadingTaskAction} from './ReadingTaskAction';
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";

export interface IProps {
    readonly taskRep: ITaskRep<IReadingTaskAction<unknown>>;
}
export const ReadingCard = (props: IProps) => {

    const taskRep = props.taskRep;
    const {id, action, created, color} = taskRep;

    return (
        <TaskBody taskRep={taskRep}>

            <TaskBody.Main taskRep={taskRep}>

                <CardPaper>
                    <AnnotationPreview id={id}
                                       text={action.text}
                                       img={action.img}
                                       lastUpdated={action.updated}
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
