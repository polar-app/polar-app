import * as React from 'react';
import {Link} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';
import { IAnchorProps } from './buttons/MUIAnchorButton';

const useStyles = makeStyles((theme: Theme) =>
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
        }
    })
);
/**
 * An anchor (a) element with styles
 */
export const MUIAnchor = (props: IAnchorProps) => {

    const classes = useStyles();

    return (
        <Link id={props.id}
            className={[props.className, classes.root].join(' ')}
            to={{pathname: props.href}}>
            {props.children}
        </Link>
    );
};
