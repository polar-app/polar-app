import * as React from 'react';
import {IndeterminateProgressBar} from "../progress_bar/IndeterminateProgressBar";
import {VerticalCenterBox} from "./VerticalCenterBox";
import {LogData} from "./LogMessagesDataLoader";

export class LoadingMessages extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        // interface LoadingLine {
        //     readonly opacity:
        // }
        //
        // const Loading2 = () => {
        //
        // };


        const MessagesBody = (): any => {

            const messages = this.props.logData?.messages || [];

            return messages.map(message => <div key={message.id}>{message.msg}</div>);

        };

        return (
            <VerticalCenterBox paddingTop="110px">
                <div style={{
                        width: '350px'
                     }}
                     className="ml-auto mr-auto text-muted">

                    <div className="mt-0" >
                        <IndeterminateProgressBar/>
                    </div>

                    <div className="mt-3" >
                        <MessagesBody/>
                    </div>
                </div>
            </VerticalCenterBox>
        );
    }

}

export interface IProps {
    readonly logData: LogData | undefined;
}

export interface IState {
}
