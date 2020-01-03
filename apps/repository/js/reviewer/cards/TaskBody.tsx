import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {FadeIn} from "../../../../../web/js/ui/motion/FadeIn";

export class TaskBody extends React.Component<IProps, IState> {

    public render() {
        return this.props.children;
    }

    public static Main = class extends React.Component<IProps, IState> {

        public render() {

            return (

                <div className="p-1"
                     style={{
                         flexGrow: 1,
                         display: 'flex',
                         flexDirection: 'column',
                         overflowY: 'auto'
                     }}>

                    <div style={{
                             flexGrow: 1,
                             display: 'flex'
                         }}>

                        {this.props.children}

                    </div>

                </div>

            );

        }

    };

    public static Footer = class extends React.Component<IProps, IState> {

        public render() {

            return <div className="border-top">

                <div className="text-grey700 mb-1 ml-1 task-stage">
                    <b>stage: </b> {this.props.taskRep.stage}
                </div>

                <div style={{}}
                     className="text-center mb-1 mt-1">
                    {this.props.children}
                </div>

            </div>;

        }

    };

}

export interface IProps {
    readonly taskRep: TaskRep<any>;
}

export interface IState {

}
