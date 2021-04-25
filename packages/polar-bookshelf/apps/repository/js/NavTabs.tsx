import * as React from 'react';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    ReactRouterLinks,
    RouterLink
} from "../../../web/js/ui/ReactRouterLinks";
import Tabs from '@material-ui/core/Tabs';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Tab from "@material-ui/core/Tab";
import {Link, useLocation} from 'react-router-dom';
import isEqual from "react-fast-compare";

export interface ITabProps {
    readonly id: string;
    readonly idx: number;
    readonly label: string;
    readonly link: RouterLink;
}

interface IProps {
    readonly tabs: ReadonlyArray<ITabProps>;
}

export const NavTabs = React.memo(function NavTabs(props: IProps) {

    const location = useLocation();

    const activeTab =
        arrayStream(props.tabs)
            .filter(tab => ReactRouterLinks.isActive(tab.link, location))
            .first();

    const activeTabID = activeTab ? activeTab.idx : false;

    return (

        <Tabs value={activeTabID}
              textColor="inherit"
              variant="standard"
              onChange={NULL_FUNCTION}>

            {props.tabs.map(tab => (
                <Tab key={tab.idx}
                     draggable={false}
                     id={tab.id}
                     disableFocusRipple
                     disableRipple
                     component={Link}
                     to={tab.link}
                     label={tab.label}/>
            ))}

        </Tabs>

    );
}, isEqual);
