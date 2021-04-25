import * as React from 'react';
import {Link} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {URLStr} from "polar-shared/src/util/Strings";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import { Callback } from 'polar-shared/src/util/Functions';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        link: {
            textDecoration: 'none',
            color: theme.palette.text.primary
        }

    })
);

interface IProps {
    readonly id?: string;
    readonly className?: string;
    readonly href: URLStr | URLPathStr;
    readonly onClick?: Callback,
    readonly children: JSX.Element;
}

/**
 * An anchor (a) element without any style
 */
export const MUIAnchor = (props: IProps) => {

    const classes = useStyles();

    return (
        <Link id={props.id}
              className={[props.className, classes.link].join(' ')}
              to={props.href}>
            {props.children}
        </Link>
    );

};
