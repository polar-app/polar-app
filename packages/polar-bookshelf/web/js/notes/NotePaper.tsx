import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {Devices} from "polar-shared/src/util/Devices";

type IUseStylesProps = {
    readonly flushed: boolean;
};

const useStyles = makeStyles<Theme, IUseStylesProps>((theme) =>
    createStyles({
        root: ({ flushed }) => ({
            height: '100%',
            overflowY: 'auto',
            ...(! flushed ? {
                    background: theme.palette.background.paper,
                    padding: '8px 16px',
                } : {
                    padding: '0 12px',
                }
            ),
            '& > .NoteTree + .NoteTree': {
                marginTop: 70,
            }
        }),
        wrapper: {
            maxWidth: 1024,
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            flex: 1,
        },
    }),
);

type INotePaperProps = React.PropsWithChildren<{}>;

export const NotePaper = React.forwardRef<HTMLDivElement, INotePaperProps>(function NotePaper({ children }, ref) {
    const isHandHeld = React.useMemo(() => ! Devices.isDesktop(), []);
    const classes = useStyles({ flushed: isHandHeld });
    
    return (
        <div className={classes.wrapper}>
            <div className={classes.root} children={children} ref={ref} />
        </div>
    );
});
