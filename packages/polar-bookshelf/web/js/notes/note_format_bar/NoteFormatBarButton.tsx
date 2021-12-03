import React from "react";
import {Box, createStyles, darken, IconButton, lighten, makeStyles, Theme} from "@material-ui/core";
import clsx from "clsx";

interface IUseStylesOpts {
    readonly active: boolean;
}

const useStyles = makeStyles<Theme, IUseStylesOpts>((theme) =>
    createStyles({
        button: ({ active }) => {
            const activeColor = theme.palette.type === 'dark'
                ? lighten(theme.palette.background.default, 0.24)
                : darken(theme.palette.background.default, 0.15);

            return {
                fontSize: '1rem',
                background: active ? activeColor : 'inherit',
            };
        },
    })
);

interface INoteFormatBarButton {
    readonly onClick: () => void;
    readonly icon: ReturnType<React.FC>;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly active?: boolean;
}

export const NoteFormatBarButton: React.FC<INoteFormatBarButton> = (props) => {
    const { onClick, icon, className, style, active = false } = props;
    const classes = useStyles({ active });

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
                    style={style}
                    className={clsx(classes.button, className)}
                    onMouseDown={abortEvent}
                    onMouseUp={abortEvent}
                    onClick={handleClick}>
            {icon}
        </IconButton>
    );
};

export const useNoteFormatBarExtensionButtonStyles = makeStyles((theme) =>
    createStyles({
        icon: {
            fontSize: '1.3rem',
        },
        iconButton: {
            padding: theme.spacing(1.25),
            background: theme.palette.background.default,
            '&:focus, &:hover': {
                background: theme.palette.background.default,
            },
        },
    })
);

export const NoteFormatBarExtensionButton: React.FC<INoteFormatBarButton> = (props) => {
    const { children, className, style, ...rest } = props;
    const classes = useNoteFormatBarExtensionButtonStyles();

    return (
        <Box display="flex"
             flexDirection="column"
             alignItems="center"
             className={className} style={style}>

            <NoteFormatBarButton {...rest} className={classes.iconButton} />

            <Box fontSize="0.75rem" pt={0.5}>
                {children}
            </Box>
        </Box>
    );
};
