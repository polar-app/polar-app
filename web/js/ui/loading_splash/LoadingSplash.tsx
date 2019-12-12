import * as React from 'react';
import {LoadingMessages} from "./LoadingMessages";
import {SplashBox} from "./SplashBox";
import {IndeterminateProgressBar} from "../progress_bar/IndeterminateProgressBar";

export class LoadingSplash extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <SplashBox>

                {/*FIXME: should not be a full URL */}
                <img className="logo" width="250" height="250" src="https://getpolarized.io/assets/logo/icon.svg"/>

                {/*<IndeterminateProgressBar height="5px"/>*/}

                <LoadingMessages/>

            </SplashBox>
        );
    }

}

export interface IProps {
}

export interface IState {
}
