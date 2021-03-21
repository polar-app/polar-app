import React from 'react';
import {useDeleteConfirmation} from '../../js/mui/dialogs/MUIDialogControllers';

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
        <ChildComponent/>
    );
}

