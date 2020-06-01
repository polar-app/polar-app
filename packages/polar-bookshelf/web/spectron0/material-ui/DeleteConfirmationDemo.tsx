import React from 'react';
import {useDeleteConfirmation} from '../../js/mui/dialogs/MUIDialogControllers';
import {MUIDialogController} from "../../js/mui/dialogs/MUIDialogController";

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

