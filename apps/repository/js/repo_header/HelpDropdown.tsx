import * as React from 'react';
import {DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {HelpDropdownItem} from './HelpDropdownItem';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {ipcRenderer} from 'electron';
import {AppUpdates} from '../../../../web/js/updates/AppUpdates';
import {DistConfig} from '../../../../web/js/dist_config/DistConfig';
import {Platforms} from "polar-shared/src/util/Platforms";
import {Devices} from "../../../../web/js/util/Devices";
import {Version} from "polar-shared/src/util/Version";
import {Dialogs} from "../../../../web/js/ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NullCollapse} from "../../../../web/js/ui/null_collapse/NullCollapse";

export class HelpDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onAbout = this.onAbout.bind(this);

    }

    public render() {

        const updatesEnabled = AppRuntime.isElectron() && AppUpdates.platformSupportsUpdates();

        const isPhone = Devices.isPhone();

        return (
            <UncontrolledDropdown className="ml-1"
                                  size="md"
                                  id="help-dropdown">

                <DropdownToggle className="text-muted border"
                                color="light"
                                caret>

                    <i className="fas fa-question" style={{fontSize: '17px'}}/>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>

                    {/*<DropdownItem header>Extensions and Addons</DropdownItem>*/}

                    <TrackedDropdownItem id="about-link"
                                         title="About"
                                         tooltip="About Polar"
                                         onClick={() => this.onAbout()}
                                         />

                    <HelpDropdownItem id="documentation-link"
                                      title="Documentation"
                                      tooltip="Documentation on Polar"
                                      link="https://getpolarized.io/docs/"
                                      icon="fas fa-book"/>

                    <HelpDropdownItem id="support-link"
                                      title="Support"
                                      tooltip="Get support on Polar"
                                      link="#support"
                                      icon="fas fa-hands-helping"/>

                    <HelpDropdownItem id="chat-link"
                                      hidden={Platforms.isMobile()}
                                      title="Chat"
                                      tooltip="Chat with other Polar users live via chat (Discord)"
                                      link="https://discord.gg/GT8MhA6"
                                      icon="fab fa-discord"/>

                    <HelpDropdownItem id="create-issue-link"
                                      hidden={Platforms.isMobile()}
                                      title="Create Issue"
                                      tooltip="Create an issue (bug or feature) for the developer to investigate."
                                      link="https://github.com/burtonator/polar-bookshelf/issues/new/choose"
                                      icon="fas fa-bug"/>

                    <DropdownItem divider hidden={! DistConfig.ENABLE_PURCHASES} />

                    <HelpDropdownItem hidden={! DistConfig.ENABLE_PURCHASES}
                                      id="upgrade-to-premium-link"
                                      title="Upgrade to Premium"
                                      tooltip="Upgrade to Polar Premium and get the best Polar experience possible."
                                      link="#plans"
                                      icon="fas fa-certificate"/>

                    <DropdownItem divider hidden={! DistConfig.ENABLE_PURCHASES} />

                    <HelpDropdownItem hidden={! DistConfig.ENABLE_PURCHASES || Platforms.isMobile()}
                                      id="donate-link"
                                      title="Donate"
                                      tooltip="Donate to Polar to support development."
                                      link="https://opencollective.com/polar-bookshelf"
                                      icon="fas fa-donate"/>

                    <DropdownItem divider hidden={!updatesEnabled}/>

                    <TrackedDropdownItem id="electron-check-for-update"
                                         title="Check For App Update"
                                         tooltip="Check for a new update of the Polar Desktop app."
                                         icon="fas fa-file-download"
                                         trackingCategory="help-check-for-update"
                                         hidden={!updatesEnabled}
                                         onClick={() => ipcRenderer.send('app-update:check-for-update')}/>

                    <DropdownItem divider hidden={isPhone}/>

                    <TrackedDropdownItem id="sidebar-item-logs"
                                         hidden={isPhone}
                                         title="Logs"
                                         tooltip="Show logs on internal activity during background operations like cloud activity and sync."
                                         icon="fas fa-info-circle"
                                         onClick={() => document.location.href = '/#logs'}
                                         trackingCategory="help-logs"/>

                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }

    private onAbout() {

        const version = Version.get();

        const body = <div>

            <b>Version: </b> {version}

        </div>;

        Dialogs.alert({
            title: 'About',
            body,
            type: 'success',
            onConfirm: NULL_FUNCTION
        })

    }

}

interface IProps {
}

interface IState {

}
