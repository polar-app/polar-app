import * as React from 'react';
import {LoadingMessages} from "./LoadingMessages";
import {SplashBox} from "./SplashBox";
import {LogMessagesDataLoader} from "./LogMessagesDataLoader";
import {PolarSVGIcon} from "../svg_icons/PolarSVGIcon";

export class LoadingSplash extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <SplashBox>

                <div className="logo" style={{width: 250, height: 250}}>
                    <PolarSVGIcon/>
                </div>

                <LogMessagesDataLoader render={logData => <LoadingMessages logData={logData}/>}/>

            </SplashBox>
        );
    }

}

export interface IProps {
}

export interface IState {
}
