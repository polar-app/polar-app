import {Button} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import React from "react";
import {useHistory} from "react-router";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import {useBlocksStore} from "../store/BlocksStore";

export const CreateNote = () => {
    const dialogs = useDialogManager();
    const history = useHistory();
    const blocksStore = useBlocksStore();

    const handleCreateNote = React.useCallback(() => {
        dialogs.prompt({
            title: "Create new named note",
            autoFocus: true,
            onCancel: NULL_FUNCTION,
            onDone: (text) => {
                const id = blocksStore.createNewNamedBlock(text, {type: 'name'});
                history.push(`/notes/${id}`);
            }
        });
    }, [dialogs, history]);
    
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
