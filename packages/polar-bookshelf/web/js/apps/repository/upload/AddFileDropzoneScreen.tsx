import * as React from "react";
import {AddFileDropzoneDialog} from "./AddFileDropzoneDialog";
import {useHistory} from "react-router-dom";

export const AddFileDropzoneScreen = React.memo(() => {

    const history = useHistory();
    const [open, setOpen] = React.useState(true);

    function closeDialog() {
        setOpen(false);
        // TODO: fine a way to bo back and replace...
        history.goBack();
    }

    return (
        <AddFileDropzoneDialog open={open} onClose={closeDialog}/>
    );


});
