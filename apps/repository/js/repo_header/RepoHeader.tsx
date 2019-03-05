import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from '../RepoSidebar';
import {SplitBar, SplitBarLeft, SplitBarRight} from '../SplitBar';
import Button from 'reactstrap/lib/Button';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {DropdownItem, UncontrolledDropdown} from 'reactstrap';
import {Nav} from '../../../../web/js/ui/util/Nav';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {LinkDropdownItem} from './LinkDropdownItem';
import {LinkDropdown} from './LinkDropdown';
import {HelpDropdown} from './HelpDropdown';

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

                        <LinkDropdown/>

                        <HelpDropdown/>

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
