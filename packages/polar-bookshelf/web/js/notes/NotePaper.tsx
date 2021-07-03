import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 1024,
            height: '100%',
            overflowY: 'auto',
            borderRadius: 4,
            background: theme.palette.background.paper,
            flex: 1,
            padding: '13px 20px',
            '& > .NoteTree + .NoteTree': {
                marginTop: 70,
            }
        },
    }),
);

type INotePaperProps = React.PropsWithChildren<{}>;

export const NotePaper = React.forwardRef<HTMLDivElement, INotePaperProps>(function NotePaper({ children }, ref) {
    const classes = useStyles();
    
    return (
        <div className={classes.root} children={children} ref={ref} />
    );
});
