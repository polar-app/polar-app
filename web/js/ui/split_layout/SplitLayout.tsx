import * as React from 'react';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class SplitLayout extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-layout pl-0 pr-0">

                <div style={{display: 'flex'}}>

                    {this.props.children}

                </div>

            </div>
        );
    }

}

export class SplitLayoutLeft extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-layout-left"
                 style={{
                     // marginTop: 'auto',
                     // marginBottom: 'auto',
                     verticalAlign: 'top'
                 }}>

                {this.props.children}

            </div>

        );
    }

}

export class SplitLayoutRight extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-layout-right"
                 style={{
                     // marginTop: 'auto',
                     marginBottom: 'auto',
                     marginLeft: 'auto',
                     display: 'flex',
                     justifyContent: 'flex-end',
                     // width: '100%',
                     verticalAlign: 'top'
                 }}>

                {this.props.children}

            </div>

        );
    }

}
