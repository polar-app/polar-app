import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
        },

    }),
);

interface IProps {
    readonly open: boolean;
    readonly onClose: () => void;
    readonly children: React.ReactNode
}


export const SimpleDialog = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <Dialog transitionDuration={50}
                maxWidth="lg"
                className={classes.backdrop}
                onClose={props.onClose}
                open={props.open}>
            <div>
                {props.children}
            </div>

        </Dialog>

    );

});

