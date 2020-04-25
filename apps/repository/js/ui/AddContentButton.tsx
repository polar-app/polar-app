import * as React from 'react';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {ManualDropdown} from '../doc_repo/ManaulDropdown';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {AddContentMenuItem} from './AddContentMenuItem';
import {AddContentButtons} from "./AddContentButtons";
import {FloatingAction} from "../../../../web/js/ui/mobile/FloatingAction";
import {ActionButton} from "../../../../web/js/ui/mobile/ActionButton";
import {AppRuntimeRouter} from "../../../../web/js/ui/AppRuntimeRouter";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {MUIMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenu";
import SettingsIcon from "@material-ui/icons/Settings";
import Container from "@material-ui/core/Container";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import {ExampleDropdownMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/ExampleDropdownMenu";
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
                    color="primary"
                    size="medium">
                <label htmlFor="file-upload" className="m-0">
                    <AddIcon/> Add &nbsp;
                </label>
            </Button>
    );

    const Electron = (props: IProps) => (

        <MUIMenu caret
                 button={{
                             icon: <AddIcon/>,
                             text: 'Add',
                             color: 'primary',
                             size: 'large',
                             disableRipple: true,
                             disableFocusRipple: true,
                         }}>
            <div>

                <AddContentMenuItem id="add-content-import-from-disk"
                                    hidden={AppRuntime.isBrowser()}
                                    tooltip="Add PDF files from disk in bulk.  Select one PDF or multiple PDFs at once."
                                    icon={<InsertDriveFileIcon/>}
                                    text="Add Files from Disk"
                                    onClick={() => doAddFilesFromDisk(props)}/>

            </div>
        </MUIMenu>
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
