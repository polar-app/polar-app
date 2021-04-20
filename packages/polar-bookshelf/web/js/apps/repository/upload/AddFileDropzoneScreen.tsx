import * as React from "react";
import {useHistory} from "react-router-dom";
import {AddFileDropzoneDialog2} from "./AddFileDropzoneDialog2";

export const AddFileDropzoneScreen = React.memo(function AddFileDropzoneScreen() {

    const history = useHistory();
    const [open, setOpen] = React.useState(true);

    function closeDialog() {
        setOpen(false);
        // TODO: fine a way to bo back and replace...
        history.goBack();
    }

    return (
        <AddFileDropzoneDialog2 open={open} onClose={closeDialog}/>
    );

});
