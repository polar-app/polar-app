import {FadeIn} from "../../../../../web/js/ui/motion/FadeIn";
import Paper from "@material-ui/core/Paper";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            fontSize: '2.0rem',
        },
    }),
);

export const CardPaper: React.FC = (props) => {

    const classes = useStyles();

    return (
        <FadeIn style={{
                    display: 'flex',
                    flexGrow: 1
                }}>
            <Paper variant="outlined"
                   className={"mb-auto ml-auto mr-auto shadow-narrow p-3 " + classes.card}
                   style={{
                       minWidth: '300px',
                       maxWidth: '700px',
                       width: '85%'
                   }}>
                {props.children}
            </Paper>
        </FadeIn>
    );
};
