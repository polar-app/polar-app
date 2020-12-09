import * as React from 'react';
import {MUIErrorBoundary} from "../../../web/js/mui/MUIErrorBoundary";
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';


const ErrorRender = () => {

    const [failed, setFailed] = React.useState(false);

    setTimeout(() => setFailed(true), 1500);

    if (failed) {
        throw new Error("We failed")
    }

    return (
        <div>
            I'm about to die
        </div>
    );

}

export const ScratchStory = () => {

    return (

        <div style={{display: 'flex', flexDirection: 'column', width: '400px'}}>

            <TextField autoFocus={true} style={{padding: '10px'}}/>

            <List component="nav">

                <ListItem disableGutters button selected={false}>
                    test 1
                </ListItem>

                <ListItem disableGutters button selected={true}>
                    test 2
                </ListItem>

            </List>
        </div>

        // <MUIErrorBoundaryMessage/>
        // <DialogContent>
        //     <DialogTitle>this is the dialog</DialogTitle>
        // </DialogContent>

    )
}