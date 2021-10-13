import {Button} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import React from "react";
import {useHistory} from "react-router";
import {RoutePathNames} from "../../apps/repository/RoutePathNames";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import {NameContent} from "../content/NameContent";
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
                const content = new NameContent({
                    type: 'name',
                    data: text,
                    links: [],
                });
                const id = blocksStore.createNewNamedBlock({ content });
                history.push(RoutePathNames.NOTE(id));
            }
        });
    }, [dialogs, history, blocksStore]);

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
