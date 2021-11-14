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
            },
            "& a:visited": {
                color: theme.palette.info.light,
            },
            "& a:hover": {
                color: theme.palette.info.dark,
            },
            "& a:active": {
                color: theme.palette.info.contrastText,
            },
        }
    })

);

export interface IAnchorProps {
    readonly id?: string;
    readonly className?: string;
    readonly href: URLStr;
    readonly children: JSX.Element;
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

    return (
        <Link id={props.id}
              className={classes.root}
              to={{pathname: props.href}}
              onClick={handleClick}>

            {props.children}

        </Link>
    );

});
