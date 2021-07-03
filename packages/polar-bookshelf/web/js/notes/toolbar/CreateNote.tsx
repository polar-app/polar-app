import {Button} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import React from "react";
import {useHistory} from "react-router";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import {useBlocksTreeStore} from "../BlocksTree";

export const CreateNote = () => {
    const dialogs = useDialogManager();
    const history = useHistory();
    const blocksTreeStore = useBlocksTreeStore();

    const handleCreateNote = React.useCallback(() => {
        dialogs.prompt({
            title: "Create new named note",
            autoFocus: true,
            onCancel: NULL_FUNCTION,
            onDone: (text) => {
                const id = blocksTreeStore.createNewNamedBlock(text, {type: 'name'});
                history.push(`/notes/${id}`);
            }
        });
    }, [dialogs, history, blocksTreeStore]);
    
    return (
        <Button id="add-content-dropdown"
                color="primary"
                style={{ height: 38 }}
                variant="contained"
                disableElevation
                startIcon={<AddCircleOutlineIcon style={{ fontSize: 24 }} />}
                onClick={handleCreateNote}
                size="medium">
            New
        </Button>
    );
};
