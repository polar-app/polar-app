import React from "react";
import {Button} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useCreateNoteDialog} from "../NotesToolbar";

export const CreateNoteButton = () => {
    const handleCreateNote = useCreateNoteDialog();

    return (
        <Button color="primary"
                style={{ height: 38, padding: "0 3rem" }}
                variant="contained"
                disableElevation
                startIcon={<AddCircleOutlineIcon style={{ fontSize: 24 }} />}
                onClick={handleCreateNote}
                size="medium">
            Create a new note
        </Button>
    );
};
