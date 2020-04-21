import * as React from 'react';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    ReactRouterLinks,
    RouterLink
} from "../../../web/js/ui/ReactRouterLinks";
import Tabs from '@material-ui/core/Tabs';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Tab from "@material-ui/core/Tab";
import { useLocation } from 'react-router-dom';
import isEqual from 'react-fast-compare';

// const NavTab = () => (
//
// )

export interface ITabProps {
    readonly id: number;
    readonly label: string;
    readonly link: RouterLink;
}

interface IProps {
    readonly tabs: ReadonlyArray<ITabProps>;
}

export const NavTabs = React.memo((props: IProps) => {

    const location = useLocation();

    const activeTab =
        arrayStream(props.tabs)
            .filter(tab => ReactRouterLinks.isActive(tab.link, location))
            .first();

    const activeTagID = activeTab ? activeTab.id : 0;

    return (

        <Tabs value={activeTagID}
              textColor="inherit"
              onChange={NULL_FUNCTION}>

            {/*<SimpleTab id="nav-tab-document-repository" target={{pathname: "/"}} text="Document Repository"/>*/}
            {/*<SimpleTab id="nav-tab-annotations" target={{pathname: "/annotations"}} text="Annotations"/>*/}

            {props.tabs.map(tag => (
                <Tab key={tag.id}
                     disableFocusRipple
                     disableRipple
                     label={tag.label}/>
            ))}

        </Tabs>

    );
}, isEqual);
