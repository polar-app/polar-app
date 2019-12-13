import * as React from 'react';
import {SplashBox} from "./SplashBox";
import {IndeterminateProgressBar} from "../progress_bar/IndeterminateProgressBar";

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
            <SplashBox paddingTop="255px">
                <div style={{width: '350px'}}>

                    <div className="mt-5" >
                        <IndeterminateProgressBar/>
                    </div>

                    <div className="mt-3" >
                        <div style={{opacity: 0.33}}>Connecting to firebase...</div>
                        <div style={{opacity: 0.66}}>Initializing datastore...</div>
                        <div>Loading UI... </div>
                    </div>
                </div>
            </SplashBox>
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
