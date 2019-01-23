import * as React from 'react';
import {EditorsPicksContent} from './EditorsPicksContent';
import {RepoHeader} from '../RepoHeader';
import {MessageBanner} from '../MessageBanner';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';

export default class EditorsPicksApp extends React.Component<IProps, IState> {

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

                <EditorsPicksContent/>

            </div>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;

}

export interface IState {

}

