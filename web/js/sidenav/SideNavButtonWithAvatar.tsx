import * as React from "react";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import { deepMemo } from "../react/ReactUtils";
import {ActiveTabButton} from "./ActiveTabButton";
import {SIDENAV_SECONDARY_BUTTON_SIZE} from "./SideNav";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";
import Avatar from "@material-ui/core/Avatar";

import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import useTheme from "@material-ui/core/styles/useTheme";

interface IProps {
    readonly tab: TabDescriptor;
}

function useDeterministicColor(text: string) {

    if (! text && text.length === 0) {
        return red[500];
    }

    const colors = [
        red[500],
        pink[500],
        purple[500],
        blue[500]
    ]

    const textAsNumber = text.charCodeAt(0);

    const idx = textAsNumber % colors.length;

    return colors[idx];

}

export const SideNavButtonWithAvatar = deepMemo((props: IProps) => {

    const {tab} = props;
    const {setActiveTab} = useSideNavCallbacks();
    const theme = useTheme();

    const path = React.useMemo(() => tab.url, [tab.url]);

    const canonicalizer = React.useCallback((path: URLPathStr) => {
        const parsedURL = DocViewerAppURLs.parse(path);
        return `/doc/${parsedURL?.id}`;
    }, []);

    const avatarText = React.useMemo((): string => {

        const title = (tab.title || '').trim();

        if (title.length === 0) {
            return 'U'
        } else {
            return title.substr(0, 1).toUpperCase();
        }

    }, [tab.title])

    const backgroundColor = useDeterministicColor(tab.id);

    return (
        <ActiveTabButton title={tab.title}
                         path={path}
                         canonicalizer={canonicalizer}
                         onClick={() => setActiveTab(tab.id)}>
            <Avatar style={{
                        width: `${SIDENAV_SECONDARY_BUTTON_SIZE}px`,
                        height: `${SIDENAV_SECONDARY_BUTTON_SIZE}px`,
                        color: theme.palette.getContrastText(backgroundColor),
                        backgroundColor
                    }}>
                {avatarText}
            </Avatar>
        </ActiveTabButton>
    );
});
