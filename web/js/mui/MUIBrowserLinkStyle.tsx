import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import blue from '@material-ui/core/colors/blue';
import clsx from 'clsx';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            "& a:link": {
                color: blue[300],
            },
            "& a:visited": {
                color: blue[600],
            },
            "& a:hover": {
                color: blue[400],
            },
            "& a:active": {
                color: blue[500],
            },
        },
    }),
);

interface IProps {

    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly children: React.ReactNode;
}

/**
 * Use browser link colors for the text under this element.
 */
export const MUIBrowserLinkStyle = deepMemo(function MUIBrowserLinkStyle(props: IProps) {

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, props.className)}
             style={props.style}>

            {props.children}

        </div>
    )

});
