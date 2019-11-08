import * as React from 'react';
import {TaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";

export class CardBody extends React.Component<IProps, IState> {

    public render() {
        return this.props.children;
    }

    static Main = class extends React.Component<IProps, IState> {

        public render() {

            return <div className="p-1"
                 style={{
                     flexGrow: 1,
                     display: 'flex',
                     flexDirection: 'column',
                     overflowY: 'auto'
                 }}>

                <div style={{
                    flexGrow: 1
                }}>

                    {this.props.children}

                </div>

            </div>

        }

    };

    static Footer = class extends React.Component<IProps, IState> {

        public render() {

            return <div>

                <div className="text-sm text-grey700 mb-1 ml-1">
                    <b>stage: </b> {this.props.taskRep.stage}
                </div>

                <div style={{}}
                     className="text-center">
                    {this.props.children}
                </div>

            </div>;

        }

    }

}

export interface IProps {
    readonly taskRep: TaskRep<any>
}

export interface IState {

}
