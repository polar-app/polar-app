import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(8),
      right: theme.spacing(2),
    },
  }),
);

interface IProps {
    readonly onClick: () => void;
}

export const AddContentFab = (props: IProps) => {

    const classes = useStyles();

    return (
        <Fab color="primary"
             className={classes.fab}
             onClick={props.onClick}>
            <AddIcon/>
        </Fab>
    );

}
