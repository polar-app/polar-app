import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import {ITaskRep} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ITaskRep";

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

            return <div>

                <Divider/>

                <div className="text-center p-1">
                    {this.props.children}
                </div>

            </div>;

        }

    };

}

export interface IProps {
    readonly taskRep: ITaskRep<any>;
}

export interface IState {

}
