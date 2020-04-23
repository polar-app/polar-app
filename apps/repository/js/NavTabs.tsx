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
import isEqual from 'react-fast-compare';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        link: {
            textDecoration: 'none',
            color: theme.palette.text.secondary
        },

        linkActive: {
            textDecoration: 'none',
            color: theme.palette.text.primary,
        },

    })
);

export interface ITabProps {
    readonly id: string;
    readonly idx: number;
    readonly label: string;
    readonly link: RouterLink;
}

interface IProps {
    readonly tabs: ReadonlyArray<ITabProps>;
}

export const NavTabs = React.memo((props: IProps) => {

    const classes = useStyles();

    const location = useLocation();

    const activeTab =
        arrayStream(props.tabs)
            .filter(tab => ReactRouterLinks.isActive(tab.link, location))
            .first();

    const activeTabID = activeTab ? activeTab.idx : 0;

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
                     component={Link}
                     disableRipple
                     to={tab.link}
                     label={tab.label}/>
            ))}

        </Tabs>

    );
}, isEqual);
