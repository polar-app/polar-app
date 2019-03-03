import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {TooltipDropdown} from './TooltipDropdown';
import {Blackout} from '../Blackout';

export class AddContentButton extends React.Component<IProps, IState> {


    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false
        };


    }

    public render() {

        return (

            <TooltipDropdown id="add-content-dropdown"
                             tooltip={{
                                 text: "Add content by importing PDFs from your local drive or capturing web pages from the Internet.",
                                 placement: 'bottom'
                             }}
                             direction="down"
                             size="sm">

                <DropdownToggle style={{fontWeight: 'bold'}} color="success" caret>
                    <i className="fas fa-plus" style={{marginRight: '5px'}}></i> Add &nbsp;
                </DropdownToggle>

                <DropdownMenu className="shadow">

                    <DropdownItem id="add-content-import-from-disk"
                                  size="sm"
                                  onClick={() => this.props.importFromDisk()}>

                        <i className="fas fa-hdd"></i>
                        &nbsp; Import Files from Disk

                        <SimpleTooltip target="add-content-import-from-disk"
                                       show={0}
                                       placement="right">

                            Import PDF files from disk in bulk.  Select one PDF
                            or multiple PDFs at once.

                        </SimpleTooltip>

                    </DropdownItem>

                    <DropdownItem id="add-content-capture-web-page"
                                  size="sm"
                                  onClick={() => this.props.captureWebPage()}>

                        <i className="fab fa-chrome"></i>
                        &nbsp; Capture Web Page

                        <SimpleTooltip target="add-content-capture-web-page"
                                       show={0}
                                       placement="right">

                            Capture a web page from the web and save it for
                            annotation and long term archival.

                        </SimpleTooltip>

                    </DropdownItem>

                </DropdownMenu>

            </TooltipDropdown>

        );

    }

    private toggle(): void {
        this.setState({...this.state, open: !this.state.open});
    }

}

interface IProps {
    readonly importFromDisk: () => void;
    readonly captureWebPage: () => void;
}

interface IState {
    readonly open: boolean;
}
