import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {DropdownItem, UncontrolledDropdown} from 'reactstrap';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {LinkDropdownItem} from './LinkDropdownItem';
import {HelpDropdownItem} from './HelpDropdownItem';

export class HelpDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

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
                                      link="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd/"
                                      icon="fas fa-book"/>

                    <HelpDropdownItem id="feedback-link"
                                      title="Feedback"
                                      tooltip="Provide feedback to help us improve the App"
                                      link="https://kevinburton1.typeform.com/to/u1zNWG"
                                      icon="fas fa-poll-h"/>

                    <HelpDropdownItem id="chat-link"
                                      title="Chat"
                                      tooltip="Chat with other Polar users live via chat (Discord)"
                                      link="https://discord.gg/GT8MhA6"
                                      icon="fab fa-discord"/>

                    <HelpDropdownItem id="donate-link"
                                      title="Donate"
                                      tooltip="Donate to Polar to support development."
                                      link="https://opencollective.com/polar-bookshelf"
                                      icon="fas fa-donate"/>

                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }


}

interface IProps {
}

interface IState {

}
