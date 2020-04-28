import React from 'react';
import {useDeleteConfirmation} from './dialogs/MUIDialogControllers';
import Button from "@material-ui/core/Button";
import {MUIDialogController} from "./dialogs/MUIDialogController";

const ChildComponent = () => {
    const onClick = useDeleteConfirmation(() => console.log("Deleted"));

    // return (
    //     <Button onClick={onClick}
    //             variant="contained">delete it</Button>
    // );

    return <div/>

}

export const DeleteConfirmationDemo = () => {
    return (
        <MUIDialogController>
            <ChildComponent/>
        </MUIDialogController>
    );
}

