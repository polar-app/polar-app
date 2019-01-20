import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from './RepoSidebar';
import {SplitBar, SplitBarLeft, SplitBarRight} from './SplitBar';

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

                <SplitBar>

                    <SplitBarLeft>
                        <RepoSidebar/>
                    </SplitBarLeft>

                    <SplitBarRight>
                        <CloudAuthButton persistenceLayerManager={this.props.persistenceLayerManager} />
                    </SplitBarRight>

                </SplitBar>

            </header>

        );

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {

}
