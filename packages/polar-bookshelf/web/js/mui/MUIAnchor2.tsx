import * as React from 'react';
import {Link} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {URLStr} from "polar-shared/src/util/Strings";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import blue from '@material-ui/core/colors/blue';

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
        },
        noUnderline: {
            textDecoration: 'none',
        }

    })
);

interface IAnchorProps {
    readonly id?: string;
    readonly className?: string;
    readonly underline?: boolean;
    readonly href: URLStr | URLPathStr;
    readonly children: React.ReactNode;
}

/**
 * An anchor (a) element with styles
 */
export const MUIAnchor2 = (props: IAnchorProps) => {

    const classes = useStyles();

    return (
        <Link id={props.id}
            className={[props.className, classes.root, !props.underline ? classes.noUnderline : ""].join(' ')}
            to={{pathname: props.href}}>
            {props.children}
        </Link>
    );
};
