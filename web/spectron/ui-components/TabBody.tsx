import * as React from 'react';
import {Tab} from './TabNav';

export class TabBody extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {tab} = this.props;

        if (typeof tab.content === 'string') {

            return <webview id={'tab-webview-' + tab.id}
                            style={{height: '100%', width: '100%'}}
                            src={tab.content}/>;


        } else {
            return tab.content;
        }

    }

}


interface IProps {
    readonly tab: Tab;
}

interface IState {
}


