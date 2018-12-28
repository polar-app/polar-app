import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from './RepoSidebar';

const log = Logger.create();

const Styles: IStyleMap = {

};

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoHeader extends React.Component<IProps, IState> {


    constructor(props: IProps, context: any) {
        super(props, context);


    }

    public render() {

        return (

            <header>

                <RepoSidebar/>

                {this.props.children}

                <div id="header-filter">

                    <div className="header-filter-boxes">

                        <div className="header-filter-box">
                            <CloudAuthButton persistenceLayerManager={this.props.persistenceLayerManager} />
                        </div>

                    </div>

                </div>

            </header>

        );

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {

}
