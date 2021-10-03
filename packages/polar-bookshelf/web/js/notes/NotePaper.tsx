import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            height: '100%',
            overflowY: 'auto',
            background: theme.palette.background.paper,
            padding: '8px 16px',
            '& > .NoteTree + .NoteTree': {
                marginTop: 70,
            }
        },
        wrapper: {
            maxWidth: 1024,
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            flex: 1,
        }
    }),
);

type INotePaperProps = React.PropsWithChildren<{}>;

export const NotePaper = React.forwardRef<HTMLDivElement, INotePaperProps>(function NotePaper({ children }, ref) {
    const classes = useStyles();
    
    return (
        <div className={classes.wrapper}>
            <div className={classes.root} children={children} ref={ref} />
        </div>
    );
});
