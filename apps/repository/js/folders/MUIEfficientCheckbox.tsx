import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {FACheckSquare} from "../../../../web/spectron0/material-ui/IconsDemo";
import {FASquare} from "../../../../web/spectron0/material-ui/IconsDemo";
import React from "react";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        active: {
            color: theme.palette.secondary.main
        },
        inactive: {
            color: theme.palette.text.secondary,
            // color: theme.palette.secondary.main
        }
    }),
);


interface IProps {
    readonly checked: boolean;
}

export const MUIEfficientCheckbox = (props: IProps) => {

    const classes = useStyles();

    if (props.checked) {
        return (
            <FACheckSquare className={props.checked ? classes.active : classes.inactive}
                           style={{
                               fontSize: '1.2em',
                               margin: '2px'
                           }}/>
        )
    } else {
        return (
            <FASquare className={props.checked ? classes.active : classes.inactive}
                      style={{
                          fontSize: '1.2em',
                          margin: '2px'
                      }}/>
        )

    }

}
