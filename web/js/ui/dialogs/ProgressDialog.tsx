import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        description: {
            fontSize: '1.25rem'
        }
    }),
);

export interface ProgressDialogProps {
    readonly title: string;
    readonly description: string;
    readonly value: Percentage | 'indeterminate';
    readonly icon?: JSX.Element;
}

export const ProgressDialog = (props: ProgressDialogProps) => {

    const classes = useStyles();

    const open = props.value !== 100;

    return (

        <Dialog open={open}
                aria-labelledby="form-dialog-title">

            <>
                <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
                <DialogContent>

                    <DialogContentText className={classes.description}>

                        <div style={{
                                 display: 'flex',
                                 flexWrap: 'nowrap'
                             }}>

                            <div style={{flexGrow: 1}}>
                                {props.description}
                            </div>

                            {props.icon && (
                                <div>
                                    {props.icon}
                                </div>)}

                        </div>
                    </DialogContentText>

                    {props.value === 'indeterminate' &&
                        <LinearProgress variant="indeterminate" />}

                    {props.value !== 'indeterminate' &&
                        <LinearProgress variant="determinate" value={props.value}/>}

                </DialogContent>

            </>

        </Dialog>
    );
};
