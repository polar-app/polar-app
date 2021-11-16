import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useLinkLoader} from "../ui/util/LinkLoaderHook";
import {URLStr} from 'polar-shared/src/util/Strings';
import {deepMemo} from "../react/ReactUtils";

const useStyles = makeStyles((theme: Theme) =>

    createStyles({
        root: {
            "& a:link": {
                color: theme.palette.info.main,
                textDecoration: 'none'
            },
            "& a:visited": {
                color: theme.palette.info.light,
                textDecoration: 'none'
            },
            "& a:hover": {
                color: theme.palette.info.dark,
                textDecoration: 'none'
            },
            "& a:active": {
                color: theme.palette.info.dark,
                textDecoration: 'none'
            },
        }
    })

);

export interface IAnchorProps {
    readonly id?: string;
    readonly className?: string;
    readonly href: URLStr;
    readonly children: JSX.Element | string;
}

export type RouteDeclaration = URLStr;

export function useAnchorClickHandler(href: string) {

    const history = useHistory();
    const linkLoader = useLinkLoader();

    return React.useCallback((event: React.MouseEvent) => {

        if (href.startsWith('http:') || href.startsWith('https:')) {
            linkLoader(href, {focus: true, newWindow: true});
        } else {
            history.push(href);
        }

        // needed to prevent the default href handling.  The way this works is that the
        // click handler is fired then the default browser behavior for navigating URLs is
        // NOT fired because we prevent it here.

        event.preventDefault();
        event.stopPropagation();

    }, [history, href, linkLoader]);

}

/**
 * An anchor (a) element with the correct URL handling including react-router
 * history
 */
export const MUIAnchor = deepMemo((props: IAnchorProps) => {

    const classes = useStyles();

    const handleClick = useAnchorClickHandler(props.href);

    // NOTE: we're using a parent span so the above CSS rules match. It's a hack
    // and we should try to fix it in the future.

    // WARN: There's a Link element in both React Router and Material UI.  We're
    // using the one from React Router but it's really not necessary because
    // the onClick handler is being used. That said, do not use the MUI Link
    // because it WILL NOT work with CSS visited, etc.

    return (
        <span className={classes.root}>
            <Link id={props.id}
                  className={props.className}
                  to={props.href}
                  onClick={handleClick}>

                {props.children}

            </Link>
        </span>
    );

});
