import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import CommunityContent from './CommunityContent';
import {RepoHeader} from '../repo_header/RepoHeader';
import {
    PersistenceLayerController,
    PersistenceLayerManager
} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

const log = Logger.create();

export default class CommunityScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <div id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

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
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

export interface IState {

}
