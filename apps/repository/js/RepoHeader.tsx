import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from './RepoSidebar';
import {SplitBar, SplitBarLeft, SplitBarRight} from './SplitBar';
import Button from 'reactstrap/lib/Button';
import {SimpleTooltip} from '../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem} from 'reactstrap';
import {Nav} from '../../../web/js/ui/util/Nav';

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

                        <div>

                            <Button id="discord-button"
                                    size="sm"
                                    className="ml-1"
                                    onClick={() => Nav.openLinkWithNewTab('https://discord.gg/GT8MhA6')}
                                    color="light">

                                <i className="fab fa-discord" style={{fontSize: '22px', marginTop: 'auto', marginBottom: 'auto'}}></i>

                            </Button>

                            <SimpleTooltip target="discord-button"
                                           placement="bottom">

                                Chat with other Polar users live on Discord.

                            </SimpleTooltip>

                        </div>


                        <div>

                            <Button id="donate-button"
                                    size="sm"
                                    className="ml-1"
                                    onClick={() => Nav.openLinkWithNewTab('https://opencollective.com/polar-bookshelf')}
                                    color="light">

                                <i className="fas fa-donate" style={{fontSize: '22px'}}></i>

                            </Button>

                            <SimpleTooltip target="donate-button"
                                           placement="bottom">

                                Donate to support Polar.  Polar donations are
                                very low and development can't continue without
                                your support.

                            </SimpleTooltip>

                        </div>


                        <div>

                            <Button id="poll-button"
                                    size="sm"
                                    className="ml-1"
                                    onClick={() => Nav.openLinkWithNewTab('https://kevinburton1.typeform.com/to/u1zNWG')}
                                    color="light">

                                <i className="fas fa-poll-h" style={{fontSize: '22px'}}></i>

                            </Button>

                            <SimpleTooltip target="poll-button"
                                           placement="bottom">

                                Take a quick survey about your usage of Polar
                                to help us prioritize our feature roadmap.

                            </SimpleTooltip>

                        </div>

                        <div>

                            <Button id="help-button"
                                    size="sm"
                                    className="ml-1"
                                    onClick={() => Nav.openLinkWithNewTab('https://getpolarized.io/docs/')}
                                    color="light">
                                <i className="fas fa-question"></i>
                            </Button>

                            <SimpleTooltip target="help-button"
                                           placement="bottom">

                                Read documentation about Polar.

                            </SimpleTooltip>

                        </div>

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
