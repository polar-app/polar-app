import * as React from "react";
import {useHistory} from "react-router-dom";
import {AddFileHoverDialog} from "./AddFileHoverDialog";

export const AddFileDropzoneScreen = React.memo(() => {

    const history = useHistory();
    const [open, setOpen] = React.useState(true);

    function closeDialog() {
        setOpen(false);
        // TODO: fine a way to bo back and replace...
        history.goBack();
    }

    return (
        <AddFileHoverDialog open={open} onClose={closeDialog}/>
    );

});
