import * as React from 'react';
import {SplashBox} from "./SplashBox";
import {IndeterminateProgressBar} from "../progress_bar/IndeterminateProgressBar";
import {VerticalCenterBox} from "./VerticalCenterBox";

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

        return (
            <VerticalCenterBox paddingTop="110px">
                <div style={{
                        width: '350px'
                     }}
                     className="ml-auto mr-auto">

                    <div className="mt-0" >
                        <IndeterminateProgressBar/>
                    </div>

                    <div className="mt-3" >
                        <div style={{opacity: 0.33}}>Connecting to firebase...</div>
                        <div style={{opacity: 0.66}}>Initializing datastore...</div>
                        <div>Loading UI... </div>
                    </div>
                </div>
            </VerticalCenterBox>
        );
    }

}

export interface LoadingMsg {
    readonly message: string;
}

export type LoadingMsgs = [LoadingMsg, LoadingMsg?, LoadingMsg?];

export interface IProps {
}

export interface IState {
}
