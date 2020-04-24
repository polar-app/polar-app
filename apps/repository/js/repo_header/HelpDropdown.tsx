import * as React from 'react';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {HelpDropdownItem} from './HelpDropdownItem';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {ipcRenderer} from 'electron';
import {AppUpdates} from '../../../../web/js/updates/AppUpdates';
import {DistConfig} from '../../../../web/js/dist_config/DistConfig';
import {AboutDialogs} from "./AboutDialogs";
import {Devices} from "polar-shared/src/util/Devices";
import {MUIDropdownMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownMenu";
import HelpIcon from '@material-ui/icons/Help';
import {MUIDropdownItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownItem";
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import InfoIcon from '@material-ui/icons/Info';
import {Link} from "react-router-dom";
import {MUIRouterLink} from "../../../../web/spectron0/material-ui/MUIRouterLink";

export class HelpDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onAbout = this.onAbout.bind(this);

    }

    public render() {

        const updatesEnabled = AppRuntime.isElectron() && AppUpdates.platformSupportsUpdates();

        const isPhone = Devices.isPhone();

        const isDesktop = Devices.isDesktop();

        return (

            <MUIDropdownMenu id="help-dropdown"
                             placement="bottom-end"
                             button={{
                                 icon: <HelpIcon/>,
                                 size: 'medium'
                             }}>

                <div>

                    <MUIDropdownItem id="about-link" icon={<InfoIcon/>} text="About" onClick={() => this.onAbout()}/>

                    <MUIDropdownItem id="documentation-link"
                                     icon={<LocalLibraryIcon/>}
                                     text="Documentation"
                                     link="https://getpolarized.io/docs/"/>

                    <MUIDropdownItem id="documentation-link"
                                     icon={<LocalLibraryIcon/>}
                                     text="Documentation"
                                     link="https://getpolarized.io/docs/"/>

                    <MUIRouterLink to="/support">
                        <MUIDropdownItem id="support-link"
                                         icon={<LocalLibraryIcon/>}
                                         text="Support"/>
                    </MUIRouterLink>

                </div>

            </MUIDropdownMenu>
        );

        //     <UncontrolledDropdown className="ml-1"
        //                           size="md"
        //                           id="help-dropdown">
        //
        //         <DropdownToggle className="text-muted border"
        //                         color="clear"
        //                         caret>
        //
        //             <i className="fas fa-question" style={{fontSize: '17px'}}/>
        //
        //         </DropdownToggle>
        //
        //         <DropdownMenu className="shadow" right>
        //
        //             {/*<DropdownItem header>Extensions and Addons</DropdownItem>*/}
        //

        //             <HelpDropdownItem id="support-link"
        //                               title="Support"
        //                               tooltip="Get support on Polar"
        //                               link="/support"
        //                               icon="fas fa-hands-helping"/>
        //
        //             <HelpDropdownItem id="chat-link"
        //                               hidden={! isDesktop}
        //                               title="Chat"
        //                               tooltip="Chat with other Polar users live via chat (Discord)"
        //                               link="https://discord.gg/GT8MhA6"
        //                               icon="fab fa-discord"/>
        //
        //             <HelpDropdownItem id="create-issue-link"
        //                               hidden={! isDesktop}
        //                               title="Create Issue"
        //                               tooltip="Create an issue (bug or feature) for the developer to investigate."
        //                               link="https://github.com/burtonator/polar-bookshelf/issues/new/choose"
        //                               icon="fas fa-bug"/>
        //
        //             <DropdownItem divider hidden={! DistConfig.ENABLE_PURCHASES} />
        //
        //             <HelpDropdownItem hidden={! DistConfig.ENABLE_PURCHASES}
        //                               id="upgrade-to-premium-link"
        //                               title="Upgrade to Premium"
        //                               tooltip="Upgrade to Polar Premium and get the best Polar experience possible."
        //                               link="/plans"
        //                               icon="fas fa-certificate"/>
        //
        //             <DropdownItem divider hidden={! DistConfig.ENABLE_PURCHASES} />
        //
        //             <HelpDropdownItem hidden={! DistConfig.ENABLE_PURCHASES || ! isDesktop}
        //                               id="donate-link"
        //                               title="Donate"
        //                               tooltip="Donate to Polar to support development."
        //                               link="https://opencollective.com/polar-bookshelf"
        //                               icon="fas fa-donate"/>
        //
        //             <DropdownItem divider hidden={!updatesEnabled}/>
        //
        //             <TrackedDropdownItem id="electron-check-for-update"
        //                                  title="Check For App Update"
        //                                  tooltip="Check for a new update of the Polar Desktop app."
        //                                  icon="fas fa-file-download"
        //                                  trackingCategory="help-check-for-update"
        //                                  hidden={!updatesEnabled}
        //                                  onClick={() => ipcRenderer.send('app-update:check-for-update')}/>
        //
        //             <DropdownItem divider/>
        //
        //             <HelpDropdownItem id="sidebar-item-device"
        //                               title="Device"
        //                               tooltip="Information about the current device"
        //                               icon="fas fa-tablet-alt"
        //                               link="/device"/>
        //
        //             <HelpDropdownItem id="sidebar-item-logs"
        //                               hidden={isPhone}
        //                               title="Logs"
        //                               tooltip="Show logs on internal activity during background operations like cloud activity and sync."
        //                               icon="fas fa-info-circle"
        //                               link="/logs"/>
        //
        //         </DropdownMenu>
        //
        //     </UncontrolledDropdown>
        // );

    }

    private onAbout() {
        AboutDialogs.create();
    }

}

interface IProps {
}

interface IState {

}
