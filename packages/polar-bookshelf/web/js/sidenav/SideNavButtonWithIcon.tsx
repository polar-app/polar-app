import * as React from "react";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import {deepMemo} from "../react/ReactUtils";
import {FaFilePdfIcon} from "../mui/MUIFontAwesome";
import {ActiveTabButton} from "./ActiveTabButton";
import {SIDENAV_SECONDARY_BUTTON_SIZE} from "./SideNav";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {DocViewerAppURLs} from "../../../apps/doc/src/DocViewerAppURLs";

interface IProps {
    readonly tab: TabDescriptor;

}

export const SideNavButtonWithIcon = deepMemo(function SideNavButtonWithIcon(props: IProps) {

    const {tab} = props;
    const {setActiveTab} = useSideNavCallbacks();

    const path = React.useMemo(() => tab.url, [tab.url]);

    const canonicalizer = React.useCallback((path: URLPathStr) => {
        const parsedURL = DocViewerAppURLs.parse(path);
        return `/doc/${parsedURL?.id}`;
    }, []);

    return (
        <ActiveTabButton title={tab.title}
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
