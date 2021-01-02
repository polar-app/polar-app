import * as React from "react";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import { deepMemo } from "../react/ReactUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {FAFileIcon} from "../mui/MUIFontAwesome";
import IconButton from "@material-ui/core/IconButton";
import {SIDENAV_WIDTH} from "./SideNav";

const BORDER = 3;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: `${SIDENAV_WIDTH}px`,
            display: 'flex',
            justifyContent: 'center'
        },
        button: {

            borderLeftWidth: `${BORDER}`,
            borderLeftStyle: 'solid',
            borderLeftColor: 'transparent',

            borderRightWidth: `${BORDER}`,
            borderRightStyle: 'solid',
            borderRightColor: 'transparent',

            '&:hover': {
                borderLeftColor: theme.palette.secondary.light
            },

        },
        activeButton: {
            borderLeftColor: theme.palette.secondary.dark,
        },
    }),
);

interface IProps {
    readonly tabID: number;
    readonly children: JSX.Element;
}

export const ActiveTabBox = deepMemo((props: IProps) => {

    const {tabID} = props;
    const {activeTab} = useSideNavStore(['tabs', 'activeTab']);
    const classes = useStyles();

    const active = tabID === activeTab;

    return (
        <div className={clsx(classes.root, classes.button, active && classes.activeButton)}>
            {props.children}
        </div>
    );

});
