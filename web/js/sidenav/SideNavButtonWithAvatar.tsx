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
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import cyan from '@material-ui/core/colors/cyan';
import deepOrange from '@material-ui/core/colors/deepOrange';

import useTheme from "@material-ui/core/styles/useTheme";
import { Hashcodes } from "polar-shared/src/util/Hashcodes";

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
        blue[500],
        deepPurple[500],
        indigo[500],
        cyan[500],
        deepOrange[500]
    ]

    // we use a hashcode because the IDs created by fingerprints aren't random.
    const hashcode = Hashcodes.create(text);
    const textForConversion = hashcode[hashcode.length - 1];
    const textAsNumber = textForConversion.charCodeAt(0);

    if (isNaN(textAsNumber)) {
        throw new Error("Text can not be converted to a number (NaN) from " + textForConversion);
    }

    const idx = textAsNumber % colors.length;

    const color = colors[idx];

    if (! color) {
        throw new Error("Unable to determine color using index: " + idx);
    }

    return color;

}

export const SideNavButtonWithAvatar = deepMemo(function SideNavButtonWithAvatar(props: IProps) {

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
