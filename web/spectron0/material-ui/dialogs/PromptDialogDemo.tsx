import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {InputValidator} from "../../../js/ui/dialogs/InputValidators";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cancelButton: {
            color: theme.palette.text.secondary,
        },
        textField: {
            minWidth: '350px'
        },
        description: {
            fontSize: '1.25rem'
        }
    }),
);

interface IProps {
    title: string;
    label: string;
    description?: string;
    defaultValue?: string;
    placeholder?: string;
    autoFocus?: boolean;
    validator?: InputValidator;
    type?: 'email' | 'number' | 'search' | 'password'
    onCancel: () => void;
    onDone: (value: string) => void;
}

export const PromptDialog = (props: IProps) => {

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Open prompt dialog
            </Button>
            <Dialog open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
                <DialogContent>

                    {props.description &&
                        <DialogContentText className={classes.description}>
                            {props.description}
                        </DialogContentText>}

                    <TextField className={classes.textField}
                               autoFocus={props.autoFocus}
                               margin="dense"
                               id="name"
                               label={props.label}
                               type={props.type}
                               fullWidth/>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose}
                            size="large"
                            variant="contained"
                            color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export const PromptDialogDemo = () => (
    <PromptDialog title="Enter a title"
                  description="Enter a title for this document: "
                  label="Title"
                  onCancel={() => console.log('cancel')}
                  onDone={() => console.log('done')}/>
);

