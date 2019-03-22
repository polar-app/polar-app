import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {TooltipDropdown} from './TooltipDropdown';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';

export class ShareContentButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false
        };


    }

    public render() {

        return (

            <TooltipDropdown id="share-content-dropdown"
                             tooltip={{
                                 text: "Share content",
                                 placement: 'left'
                             }}
                             direction="down"
                             size="sm">

                <DropdownToggle style={{fontWeight: 'bold'}} color="success" caret>
                    <i className="fas fa-plus" style={{marginRight: '5px'}}></i> Add &nbsp;
                </DropdownToggle>

                <DropdownMenu className="shadow">

                    <DropdownItem id="add-content-import-from-disk"
                                  hidden={AppRuntime.isBrowser()}
                                  size="sm"
                                  onClick={() => this.props.importFromDisk()}>

                        <i className="fas fa-hdd"></i>
                        &nbsp; Add Files from Disk

                        <SimpleTooltip target="add-content-import-from-disk"
                                       show={0}
                                       placement="right">

                            Add PDF files from disk in bulk.  Select one PDF
                            or multiple PDFs at once.

                        </SimpleTooltip>

                    </DropdownItem>

                    <DropdownItem id="add-content-import-from-disk-via-file-upload"
                                  hidden={AppRuntime.isElectron()}
                                  onClick={() => this.triggerFileUpload()}
                                  size="sm">

                        <i className="fas fa-hdd"></i>
                        &nbsp; Upload Files from Disk

                        <SimpleTooltip target="add-content-import-from-disk-via-file-upload"
                                       show={0}
                                       placement="right">

                            Upload PDF files from disk in bulk.  Select one PDF
                            or multiple PDFs at once.

                        </SimpleTooltip>

                    </DropdownItem>

                    <DropdownItem id="add-content-capture-web-page"
                                  hidden={AppRuntime.isBrowser()}
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

    private triggerFileUpload() {
        document.getElementById('file-upload')!.click();
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
