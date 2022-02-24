import React from "react";
import {Button, createStyles, makeStyles} from "@material-ui/core";
import clsx from "clsx";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            height: theme.spacing(2),
            minWidth: 0,
            color: theme.palette.text.secondary,
            '&.active': {
                backgroundColor: theme.palette.background.default,
            },
        }
    })
);


interface IProps {
    readonly onClick: React.EventHandler<React.MouseEvent>;
    readonly active?: boolean;
}

export const MUIBreadcrumbsOverflowIconButton: React.FC<IProps> = (props) => {
    const classes = useStyles();
    const { onClick, active } = props;

    return (
        <Button variant="text"
                className={clsx(classes.root, { active })}
                size="small"
                onClick={onClick}>
            <MoreHorizIcon fontSize="small" />
        </Button>
    );
};
