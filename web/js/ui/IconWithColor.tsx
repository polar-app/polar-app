import * as React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
        },
        textSecondary: {
            color: theme.palette.text.secondary
        }
    }),
);

interface IProps {
    readonly color: 'text.secondary';
    readonly Component: React.FunctionComponent<{className?: string}>;
}

export const IconWithColor = React.memo(function IconWithColor(props: IProps) {

    const classes = useStyles();

    const Component = props.Component;

    return (
        <Component className={classes.textSecondary}/>
    );

});
