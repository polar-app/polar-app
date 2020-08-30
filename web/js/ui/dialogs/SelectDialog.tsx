import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import {IDStr} from "polar-shared/src/util/Strings";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from '@material-ui/core/ListItem';
import List from "@material-ui/core/List";

export interface SelectItem {
    readonly id: IDStr;
    readonly label: string;
    // TODO icon in the future.
}

export interface SelectDialogProps {

    readonly title: string;

    readonly options: ReadonlyArray<SelectItem>;

    readonly defaultValue?: IDStr;

    readonly onCancel: () => void;

    readonly onDone: (selected: SelectItem) => void;

}

/**
 * Select from a list of options.
 */
export const SelectDialog = (props: SelectDialogProps) => {

    const [open, setOpen] = React.useState(true);

    const handleCancel = () => {
        props.onCancel();
        setOpen(false);
    }

    const handleDone = (item: SelectItem) => {
        // noop
        setOpen(false);
    }

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {

        props.onCancel();

        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

    };

    function toListItem(item: SelectItem) {
        return (
            <ListItem key={item.id}
                      autoFocus={item.id === props.defaultValue}
                      button
                      onClick={() => handleDone(item)}>
                <ListItemText primary={item.label} />
            </ListItem>
        );
    }

    return (

        <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>

            <DialogContent>
                <List>
                    {props.options.map(toListItem)}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>

    );

};
