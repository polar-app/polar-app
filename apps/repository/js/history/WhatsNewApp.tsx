import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {WhatsNewContent} from '../splash/splashes/whats_new/WhatsNewContent';

const log = Logger.create();

export default class WhatsNewApp extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <header>

                    <RepoSidebar/>

                </header>

                <MessageBanner/>

                <div className="m-2">
                    <WhatsNewContent/>
                </div>

            </div>

        );
    }

}

export interface IProps {

}

export interface IState {

}
