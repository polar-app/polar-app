import * as React from 'react';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {ManualDropdown} from '../doc_repo/ManaulDropdown';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {AddContentDropdownItem} from './AddContentDropdownItem';
import {AddContentButtons} from "./AddContentButtons";
import {FloatingAction} from "../../../../web/js/ui/mobile/FloatingAction";
import {ActionButton} from "../../../../web/js/ui/mobile/ActionButton";
import {Button} from "reactstrap";
import {AppRuntimeRouter} from "../../../../web/js/ui/AppRuntimeRouter";

namespace runtime {

    function doAddFilesFromDisk(props: IProps) {
        AddContentButtons.doAccountVerifiedAction(() => props.importFromDisk());
    }

    function doCaptureWebPage(props: IProps) {
        AddContentButtons.doAccountVerifiedAction(() => props.captureWebPage());
    }

    function doFileUpload() {
        AddContentButtons.doAccountVerifiedAction(() => AddContentButtons.triggerFileUpload());
    }

    export const Main = (props: IProps) => (
        <AppRuntimeRouter browser={<Browser/>}
                          electron={<Electron {...props}/>}/>
    );

    const Browser = () => (
            <Button id="add-content-dropdown"
                    color="success"
                    size="md">
                <label htmlFor="file-upload" className="m-0">
                    <i className="fas fa-plus mr-1" /> Add &nbsp;
                </label>
            </Button>
    );

    const Electron = (props: IProps) => (
        <ManualDropdown id="add-content-dropdown"
                        direction="down"
                        size="md">

            <SimpleTooltipEx text="Add content by importing PDFs from your local drive or capturing web pages from the Internet."
                             placement="bottom">

                <DropdownToggle size="md" style={{fontWeight: 'bold'}} color="success" caret>
                    <i className="fas fa-plus mr-1" /> Add &nbsp;
                </DropdownToggle>

            </SimpleTooltipEx>

            <DropdownMenu className="shadow">

                <AddContentDropdownItem id="add-content-import-from-disk"
                                        hidden={AppRuntime.isBrowser()}
                                        tooltip="Add PDF files from disk in bulk.  Select one PDF or multiple PDFs at once."
                                        onClick={() => doAddFilesFromDisk(props)}>

                    <i className="fas fa-hdd"/>
                    &nbsp; Add Files from Disk

                </AddContentDropdownItem>

                <AddContentDropdownItem id="add-content-import-from-disk-via-file-upload"
                                        hidden={AppRuntime.isElectron()}
                                        tooltip="Upload PDF files from disk in bulk.  Select one PDF or multiple PDFs at once."
                                        onClick={() => doFileUpload()}>

                    <label htmlFor="file-upload">
                        <i className="fas fa-hdd"/>
                        &nbsp; Upload Documents
                    </label>

                </AddContentDropdownItem>

                <AddContentDropdownItem id="add-content-capture-web-page"
                                        hidden={AppRuntime.isBrowser()}
                                        tooltip="Capture a web page from the web and save it for annotation and long term archival."
                                        onClick={() => doCaptureWebPage(props)}>

                    <i className="fab fa-chrome"/>
                    &nbsp; Capture Web Page

                </AddContentDropdownItem>

            </DropdownMenu>

        </ManualDropdown>
    );

}

export namespace AddContent {

    function doAddFilesFromDisk(props: IProps) {
        AddContentButtons.doAccountVerifiedAction(() => props.importFromDisk());
    }

    function doCaptureWebPage(props: IProps) {
        AddContentButtons.doAccountVerifiedAction(() => props.captureWebPage());
    }

    function doFileUpload() {
        AddContentButtons.doAccountVerifiedAction(() => AddContentButtons.triggerFileUpload());
    }

    // TODO: this still won't work on desktop safari...

    export const Handheld = () => (

        <FloatingAction style={{
                            marginBottom: '60px',
                            marginRight: '20px'
                        }}>
            <label htmlFor="file-upload">

                <ActionButton icon="fas fa-plus"
                              onClick={() => doFileUpload()}
                              color="success"/>

            </label>

        </FloatingAction>

    );

    export const Desktop = (props: IProps) => (
        <runtime.Main {...props}/>
    );

}

interface IProps {
    readonly importFromDisk: () => void;
    readonly captureWebPage: () => void;
}
