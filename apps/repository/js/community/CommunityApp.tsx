import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import CommunityContent from './CommunityContent';
import {RepoHeader} from '../RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';

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

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

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
    readonly persistenceLayerManager: PersistenceLayerManager;
}

export interface IState {

}
