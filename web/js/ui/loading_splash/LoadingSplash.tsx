import * as React from 'react';
import {LoadingMessages} from "./LoadingMessages";
import {SplashBox} from "./SplashBox";
import {LogMessagesDataLoader} from "./LogMessagesDataLoader";

export class LoadingSplash extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <SplashBox>

                <img className="logo" width="250" height="250" src="/icon.svg"/>

                <LogMessagesDataLoader render={logData => <LoadingMessages logData={logData}/>}/>

            </SplashBox>
        );
    }

}

export interface IProps {
}

export interface IState {
}
