import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {NoteFormatBarButton} from "./NoteFormatBarButton";

interface IProps {
    icon: React.FC<{ className?: string }>;
    className?: string;
    style?: React.CSSProperties;
    active?: boolean;
    onClick: () => void;
}

export const useStyles = makeStyles((theme) =>
    createStyles({
        icon: {
            padding: theme.spacing(0.25),
            color: theme.palette.text.secondary,
        },
    })
);

export const NoteFormatBarActionIcon: React.FC<IProps> = (props) => {
    const { icon: Icon, className, onClick, active } = props;
    const classes = useStyles();

    return (
        <NoteFormatBarButton icon={<Icon className={classes.icon} />}
                             className={className}
                             active={active}
                             onClick={onClick} />
    );
};
