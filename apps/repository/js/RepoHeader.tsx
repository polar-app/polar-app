import * as React from 'react';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody, Tooltip} from 'reactstrap';
import {ConfirmPopover} from '../../../web/js/ui/confirm/ConfirmPopover';
import {TextInputPopover} from '../../../web/js/ui/text_input/TextInputPopover';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {ListOptionType, ListSelector} from "../../../web/js/ui/list_selector/ListSelector";
import {LightboxPopover} from '../../../web/js/ui/lightbox_popover/LightboxPopover';
import {TableColumns} from './TableColumns';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';
import {LargeModalBody} from '../../../web/js/ui/large_modal/LargeModalBody';
import {FilterTagInput} from './FilterTagInput';
import {CloudAuthButton} from '../../../web/js/ui/cloud_auth/CloudAuthButton';
import {TableDropdown} from './TableDropdown';
import {PersistenceLayerManager} from '../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from './RepoSidebar';
import {NavLogo} from './nav/NavLog';

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
