import * as React from "react";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import { deepMemo } from "../react/ReactUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {FAFileIcon, FaFilePdfIcon} from "../mui/MUIFontAwesome";
import IconButton from "@material-ui/core/IconButton";
import {ActiveTabButton} from "./ActiveTabButton";
import {MUITooltip} from "../mui/MUITooltip";
import {SIDENAV_BUTTON_SIZE, SIDENAV_SECONDARY_BUTTON_SIZE} from "./SideNav";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";

const WIDTH = 72;
const BORDER = 3;

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            // borderRadius: '5px',
            // width: `${WIDTH - (BORDER * 2)}px`,
            //
            // borderLeftWidth: `${BORDER}`,
            // borderLeftStyle: 'solid',
            // borderLeftColor: 'transparent',
            //
            // borderRightWidth: `${BORDER}`,
            // borderRightStyle: 'solid',
            // borderRightColor: 'transparent',
            //
            // marginBottom: '5px',
            // cursor: 'pointer',

            color: theme.palette.text.secondary,

            "& img": {
                width: `${WIDTH - (BORDER * 2)}px`,
                borderRadius: '5px',
            },
            '&:hover': {
                borderLeftColor: theme.palette.secondary.main,
                color: theme.palette.text.primary,
            },

        },
        activeButton: {
            borderLeftColor: theme.palette.secondary.main
        },
    }),
);

interface IProps {
    readonly tab: TabDescriptor;

}

export const SideNavButtonWithIcon = deepMemo((props: IProps) => {

    const {tab} = props;
    const {setActiveTab} = useSideNavCallbacks();

    const path = React.useMemo(() => tab.url, [tab.url]);

    const canonicalizer = React.useCallback((path: URLPathStr) => {
        const parsedURL = DocViewerAppURLs.parse(path);
        return `/doc/${parsedURL?.id}`;
    }, []);

    return (
        <ActiveTabButton title={tab.title}
                         tabID={tab.id}
                         path={path}
                         canonicalizer={canonicalizer}
                         onClick={() => setActiveTab(tab.id)}>
            <FaFilePdfIcon style={{
                               width: `${SIDENAV_SECONDARY_BUTTON_SIZE}px`,
                               height: `${SIDENAV_SECONDARY_BUTTON_SIZE}px`
                           }}/>
        </ActiveTabButton>
    );
});