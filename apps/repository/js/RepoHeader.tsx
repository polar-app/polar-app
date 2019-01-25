import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from './RepoSidebar';
import {SplitBar, SplitBarLeft, SplitBarRight} from './SplitBar';
import Button from 'reactstrap/lib/Button';
import {Tooltip} from '../../../web/js/ui/tooltip/Tooltip';
import {DropdownItem} from 'reactstrap';

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

                        <Button id="discord-button"
                                size="sm"
                                className="ml-1"
                                onClick={() => document.location!.href = 'https://discord.gg/GT8MhA6'}
                                color="light">

                            <i className="fab fa-discord" style={{fontSize: '22px', marginTop: 'auto', marginBottom: 'auto'}}></i>

                        </Button>

                        <Tooltip target="discord-button"
                                 placement="bottom">

                            Chat with other Polar users live on Discord.

                        </Tooltip>

                        <Button id="donate-button"
                                size="sm"
                                className="ml-1"
                                onClick={() => document.location!.href = 'https://opencollective.com/polar-bookshelf'}
                                color="light">

                            <i className="fas fa-donate" style={{fontSize: '22px'}}></i>

                        </Button>

                        <Tooltip target="donate-button"
                                 placement="bottom">

                            Donate to support Polar

                        </Tooltip>


                        <Button id="help-button"
                                size="sm"
                                className="ml-1"
                                onClick={() => document.location!.href = 'https://getpolarized.io/docs/'}
                                color="light">
                            <i className="fas fa-question"></i>
                        </Button>

                        <Tooltip target="help-button"
                                 placement="bottom">

                            Read documentation about Polar.

                        </Tooltip>



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
