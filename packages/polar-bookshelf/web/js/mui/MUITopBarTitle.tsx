import {createStyles, makeStyles, Popover, Typography} from "@material-ui/core";
import React from "react";
import clsx from "clsx";

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        popup: {
            background: theme.palette.background.default,
            padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`,
            fontSize: "1.15rem",
        },
    })
);

export const MUITopBarTitle: React.FC<IProps> = (props) => {
    const { className, style } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handlePopoverClose = React.useCallback(() => {
        setAnchorEl(null);
    }, []);


    return (
        <>
            <Popover anchorEl={anchorEl}
                     keepMounted
                     classes={{ paper: classes.popup }}
                     open={anchorEl !== null}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left',
                     }}
                     transformOrigin={{
                         vertical: 'top',
                         horizontal: 'left',
                     }}
                     onClose={handlePopoverClose}>

                {props.children}

            </Popover>

            <Typography color="textPrimary"
                        style={style}
                        onClick={handleClick}
                        className={clsx(classes.root, className)}>
                {props.children}
            </Typography>
        </>
    );
};
