import React from "react";
import {createStyles, IconButton, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            fontSize: '12px',
            '& + &': {
                marginLeft: theme.spacing(1.2),
            },
        },
    })
);

interface INoteFormatBarButton {
    readonly onClick: () => void;
    readonly icon: ReturnType<React.FC>;
}

export const NoteFormatBarButton: React.FC<INoteFormatBarButton> = (props) => {
    const { onClick, icon } = props;
    const classes = useStyles();

    const abortEvent = React.useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
    }, []);

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        abortEvent(event);

        onClick();
    }, [onClick, abortEvent]);

    return (
        <IconButton size="small"
                    className={classes.button}
                    onMouseDown={abortEvent}
                    onMouseUp={abortEvent}
                    onClick={handleClick}>
            {icon}
        </IconButton>
    );
};
