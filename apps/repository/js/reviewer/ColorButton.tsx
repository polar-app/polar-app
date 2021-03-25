import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEqual from "react-fast-compare";
import { createStyles, darken } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    return createStyles({
        // style rule
        root: (props: IProps) => ({
            color: theme.palette.getContrastText(props.color),
            backgroundColor: props.color,
            '&:hover': {
                backgroundColor: darken(props.color, 0.3),
            },
        }),
    })
})

interface IProps extends Omit<ButtonProps, "color"> {
    readonly color: string;
}


// https://material-ui.com/styles/basics/#adapting-based-on-props
export const ColorButton = React.memo(function ColorButton(props: IProps) {
    // Pass the props as the first argument of useStyles()
    const classes = useStyles(props);

    const buttonProps: any = {...props};
    delete buttonProps.color;

    return (
        <Button className={`${classes.root}`} {...buttonProps}>
            {props.children}
        </Button>
    );
}, isEqual);
