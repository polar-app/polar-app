import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from './RepoSidebar';
import {SplitBar, SplitBarLeft, SplitBarRight} from './SplitBar';
import Button from 'reactstrap/lib/Button';

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

            <div className="border-bottom mb-1">
                <SplitBar>

                    <SplitBarLeft>
                        <RepoSidebar/>
                    </SplitBarLeft>

                    <SplitBarRight>

                        <CloudAuthButton persistenceLayerManager={this.props.persistenceLayerManager} />

                        <Button size="sm"
                                className="ml-1"
                                onClick={() => document.location!.href = 'https://getpolarized.io/docs/'}
                                color="light">
                            <i className="fas fa-question"></i>
                        </Button>

                    </SplitBarRight>

                </SplitBar>
            </div>

        );

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {

}
