import * as React from 'react';
import {AddContentMenuItem} from './AddContentMenuItem';
import {AddContentButtons} from "./AddContentButtons";
import {AppRuntimeRouter} from "../../../../web/js/ui/AppRuntimeRouter";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import {AddContentFab} from "./AddContentFab";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import { useHistory } from 'react-router-dom';
//
// namespace runtime {
//
//     export const Main = () => (
//         <AppRuntimeRouter browser={<Browser/>}
//                           electron={<Electron/>}/>
//     );
//
//     const Browser = () => (
//             <Button id="add-content-dropdown"
//                     variant="contained"
//                     color="primary"
//                     startIcon={<AddIcon/>}
//                     size="large">
//                 <label htmlFor="file-upload" className="m-0">
//                     Add
//                 </label>
//             </Button>
//     );
//
//     const Electron = React.memo(() => {
//
//         const history = useHistory();
//
//         return (
//             <MUIMenu caret
//                      button={{
//                          icon: <AddIcon/>,
//                          text: 'Add',
//                          color: 'primary',
//                          size: 'large',
//                          disableRipple: true,
//                          disableFocusRipple: true,
//                      }}>
//                 <div>
//
//                     <AddContentMenuItem id="add-content-import-from-disk"
//                                         hidden={AppRuntime.isBrowser()}
//                                         tooltip="Add PDF files from disk in bulk.  Select one PDF or multiple PDFs at once."
//                                         icon={<InsertDriveFileIcon/>}
//                                         text="Add Files from Disk"
//                                         onClick={doAdd}/>
//
//                 </div>
//             </MUIMenu>
//         );
//     });
//
// }

export namespace AddContent {

    function useAddFileDropzone() {

        const history = useHistory();

        return () => {
            history.push({hash: "#add"});
        }

    }

    export const Handheld = () => {

        const doAdd = useAddFileDropzone();

        return (
            <AddContentFab onClick={() => doAdd()}/>
        );

    };

    export const Desktop = () => {

        const doAdd = useAddFileDropzone();

        return (
            <Button id="add-content-dropdown"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon/>}
                    onClick={doAdd}
                    size="large">
                Add
            </Button>
        );
    };

}
