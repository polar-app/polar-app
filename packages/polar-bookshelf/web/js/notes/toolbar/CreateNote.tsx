import {Button} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
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
                variant="outlined"
                startIcon={<AddIcon/>}
                onClick={handleCreateNote}
                size="medium">
            Create Note
        </Button>
    );
};
