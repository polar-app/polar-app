import * as React from 'react';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {NavLogo} from './nav/NavLogo';
import {GDPRNotice} from '../../../web/js/ui/gdpr/GDPRNotice';
import {SimpleTabs} from "../../../web/js/ui/simple_tab/SimpleTabs";
import {SimpleTab} from "../../../web/js/ui/simple_tab/SimpleTab";
import { FeatureToggle } from '../../../web/js/ui/FeatureToggle';
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import Tabs from "@material-ui/core/Tabs";
import {Link} from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ITabProps, NavTabs} from "./NavTabs";
import Grid from '@material-ui/core/Grid';

const TABS: ReadonlyArray<ITabProps> = [
    {
        id: 0,
        label: "Documents",
        link: {pathname: "/"},
    },
    {
        id: 1,
        label: "Annotations",
        link: {pathname: "/annotations"},
    }

];

const Styles: IStyleMap = {

    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        // display: 'none',
        backgroundColor: 'var(--primary-background-color)',
        zIndex: 99999,
        height: 'calc(100%)',
        // paddingLeft: '1px',
        // paddingTop: '1px'
    },

    subheader: {
        display: 'table'
    },

    subheaderItem: {
    }

};

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoNavbar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            expanded: false
        };

    }

    public render() {

        const display = this.state.expanded ? 'block' : 'none';

        const sidebarStyle = Object.assign({}, Styles.sidebar, {display});

        const Nav = () => {

            const Delegate =
                <div className="mt-auto mb-auto">

                    <div>

                        <NavTabs tabs={TABS}/>

                        {/*<SimpleTabs>*/}
                        {/*    <SimpleTab id="nav-tab-document-repository" target={{pathname: "/"}} text="Document Repository"/>*/}
                        {/*    <SimpleTab id="nav-tab-annotations" target={{pathname: "/annotations"}} text="Annotations"/>*/}
                        {/*    <SimpleTab id="nav-tab-statistics" target={{pathname: "/stats"}} text="Statistics"/>*/}

                        {/*    <FeatureToggle name='groups'>*/}
                        {/*        <SimpleTab id="nav-tab-groups" target={{pathname: "/groups"}} text="Groups"/>*/}
                        {/*    </FeatureToggle>*/}

                        {/*    <FeatureToggle name='dev'>*/}
                        {/*        <SimpleTab id="nav-tab-ui" target={{pathname: "/ui-components"}} text="UI Components"/>*/}
                        {/*    </FeatureToggle>*/}

                        {/*</SimpleTabs>*/}



                        {/*<Tabs value={0}*/}
                        {/*      indicatorColor="primary"*/}
                        {/*      textColor="primary"*/}
                        {/*      onChange={NULL_FUNCTION}*/}
                        {/*    >*/}

                        {/*    /!*<SimpleTab id="nav-tab-document-repository" target={{pathname: "/"}} text="Document Repository"/>*!/*/}
                        {/*    /!*<SimpleTab id="nav-tab-annotations" target={{pathname: "/annotations"}} text="Annotations"/>*!/*/}

                        {/*    /!*<Link to={{pathname: "/annotations"}}>*!/*/}
                        {/*        <Tab label="Documents"/>*/}
                        {/*        <Tab label="Notes"/>*/}
                        {/*    /!*</Link>*!/*/}

                        {/*</Tabs>*/}

                    </div>

                </div>;

            return <DeviceRouter desktop={Delegate}/>;

        };

        const NavFirstRow = () => (

            <Grid spacing={2}
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center">

                <Grid item>
                    <NavLogo/>
                </Grid>

                <Grid item>
                    <Nav/>
                </Grid>

            </Grid>
        );

        return (

            <div className="repo-sidebar">

                <GDPRNotice/>

                <NavFirstRow/>

                <section className="sidebar"
                         style={sidebarStyle}
                         data-expanded={this.state.expanded}>

                    <div className="subheader" style={Styles.subheader}>

                        <NavFirstRow/>

                    </div>

                </section>
            </div>

        );

    }

}

export interface SidebarStatus {
    readonly expanded: boolean;
}

interface IProps {
}

interface IState {
    readonly expanded: boolean;
}

