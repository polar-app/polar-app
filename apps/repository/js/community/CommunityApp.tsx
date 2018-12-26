import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {WhatsNewContent} from '../splash/splashes/whats_new/WhatsNewContent';
import CommunityContent from './CommunityContent';

const log = Logger.create();

export default class CommunityApp extends React.Component<IProps, IState> {

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

                <div className="m-1">
                    <CommunityContent/>
                </div>

            </div>

        );
    }

}

export interface IProps {

}

export interface IState {

}
