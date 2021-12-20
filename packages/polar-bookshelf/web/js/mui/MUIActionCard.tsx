import React from "react";
import {Box, Button, createStyles, makeStyles, Paper, Typography} from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import clsx from "clsx";


interface IProps {
    readonly title: string;
    readonly description: string;
    readonly actionButtonTitle?: string;
    readonly onAction?: () => void;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 296,
            width: '100%',
            padding: `${theme.spacing(2.25)}px ${theme.spacing(3)}px`,
        },
        titleIcon: {
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(1.75),
        },
        title: {
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        actionButtonOuter: {
            '& .MuiButton-root': {
                ...theme.typography.caption,
                color: theme.palette.text.secondary,
            },
        },
    })
);

export const MUIActionCard: React.FC<IProps> = (props) => {
    const {
        actionButtonTitle,
        description,
        title,
        style,
        className,
        onAction = NULL_FUNCTION,
    } = props;

    const classes = useStyles();

    return (
        <Paper className={clsx(classes.root, className)} style={style}>
            <Box display="flex" alignItems="center">
                <DescriptionIcon className={classes.titleIcon} fontSize="small" />
                <Typography className={classes.title} variant="body2">
                    {title}
                </Typography>
            </Box>

            <Box mt={2.5}>
                <Typography variant="caption">
                    {description}
                </Typography>
            </Box>

            <Box className={classes.actionButtonOuter}
                 display="flex"
                 mt={2}
                 justifyContent="flex-end"
                 width="100%">

                <Button onClick={onAction}
                        endIcon={<ArrowForwardIcon />}>
                    {actionButtonTitle}
                </Button>

            </Box>
        </Paper>
    );
};
