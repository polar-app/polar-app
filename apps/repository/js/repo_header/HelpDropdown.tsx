import * as React from 'react';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {HelpDropdownItem} from './HelpDropdownItem';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {UncontrolledDropdown} from 'reactstrap';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {ipcRenderer} from 'electron';
import {AppUpdates} from '../../../../web/js/updates/AppUpdates';

const SURVEY_LINK = 'https://kevinburton1.typeform.com/to/BuX1Ef';

export class HelpDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const updatesEnabled = AppRuntime.isElectron() && AppUpdates.platformSupportsUpdates();

        return (
            <UncontrolledDropdown className="ml-1"
                                  size="sm"
                                  id="help-dropdown">

                <DropdownToggle className="text-muted"
                                color="light"
                                caret>

                    <i className="fas fa-question" style={{fontSize: '17px'}}></i>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>

                    {/*<DropdownItem header>Extensions and Addons</DropdownItem>*/}

                    <HelpDropdownItem id="documentation-link"
                                      title="Documentation"
                                      tooltip="Documentation on Polar"
                                      link="https://getpolarized.io/docs/"
                                      icon="fas fa-book"/>

                    <HelpDropdownItem id="feedback-link"
                                      title="Feedback"
                                      tooltip="Provide feedback to help us improve the App"
                                      link={SURVEY_LINK}
                                      icon="fas fa-poll-h"/>

                    <HelpDropdownItem id="chat-link"
                                      title="Chat"
                                      tooltip="Chat with other Polar users live via chat (Discord)"
                                      link="https://discord.gg/GT8MhA6"
                                      icon="fab fa-discord"/>

                    <HelpDropdownItem id="create-issue-link"
                                      title="Create Issue"
                                      tooltip="Create an issue (bug or feature) for the developer to investigate."
                                      link="https://github.com/burtonator/polar-bookshelf/issues/new/choose"
                                      icon="fas fa-bug"/>

                    <DropdownItem divider/>

                    <HelpDropdownItem id="upgrade-to-premium-link"
                                      title="Upgrade to Polar Premium"
                                      tooltip="Upgrade to Polar Premium and get the best Polar experience possible."
                                      link="#premium"
                                      icon="fas fa-money-bill-wave"/>

                    <DropdownItem divider/>

                    <HelpDropdownItem id="donate-link"
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

                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }


}

interface IProps {
}

interface IState {

}
