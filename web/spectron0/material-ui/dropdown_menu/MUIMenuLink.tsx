import * as React from 'react';
import {Link} from 'react-router-dom';
import isEqual from 'react-fast-compare';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {RouterLink} from "../../../js/ui/ReactRouterLinks";

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
    readonly to: RouterLink;
    readonly children: JSX.Element;
}

export const MUIMenuLink = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <Link id={props.id}
              className={[props.className, classes.link].join(' ')}
              to={props.to}>
            {props.children}
        </Link>
    );

}, isEqual);
