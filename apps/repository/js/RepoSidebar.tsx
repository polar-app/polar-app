import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {Blackout} from '../../../web/js/ui/blackout/Blackout';
import {NavLogo} from './nav/NavLogo';
import {RepoSidebarItem} from './sidebar/RepoSidebarItem';
import {GDPRNotice} from '../../../web/js/ui/gdpr/GDPRNotice';
import Button from 'reactstrap/lib/Button';
import ListGroup from 'reactstrap/lib/ListGroup';
import {SimpleTooltipEx} from '../../../web/js/ui/tooltip/SimpleTooltipEx';
import {SimpleTabs} from "../../../web/js/ui/simple_tab/SimpleTabs";
import {SimpleTab} from "../../../web/js/ui/simple_tab/SimpleTab";

const log = Logger.create();

const Styles: IStyleMap = {

    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        // display: 'none',
        backgroundColor: '#fff',
        zIndex: 99999,
        height: 'calc(100%)',
        width: '200px',
        paddingLeft: '1px',
        paddingTop: '1px'
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
export class RepoSidebar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            expanded: false
        };

        window.addEventListener('keyup', event => {

            if (event.key === "Escape") {

                if (this.state.expanded) {
                    this.setState({ expanded: false });
                }

            }

        });

    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {

        if (prevState.expanded !== this.state.expanded) {
            Blackout.toggle(this.state.expanded);
        }

    }

    public render() {

        const display = this.state.expanded ? 'block' : 'none';

        const sidebarStyle = Object.assign({}, Styles.sidebar, {display});

        const NavButtons = () => (

            <div style={{display: 'flex'}}>

                <div className="mt-auto mb-auto">
                    <SimpleTooltipEx text="Toggle showing the sidebar">

                        <div id="toggle-sidebar"
                             className="mr-1">
                            <Button color='light'
                                    onClick={() => this.toggle()}>
                                <i className="fas fa-bars"></i>
                            </Button>
                        </div>

                    </SimpleTooltipEx>
                </div>

                <div className="mt-auto mb-auto">
                    <NavLogo/>
                </div>

                <div className="mt-auto mb-auto d-none-mobile">

                    <div className="ml-4">
                        <SimpleTabs>
                            <SimpleTab href="#" text="Document Repository"/>
                            <SimpleTab href="#groups" text="Groups"/>
                        </SimpleTabs>
                    </div>

                </div>

            </div>
        );

        return (

            <div className="repo-sidebar">

                <GDPRNotice/>

                <div>
                    <NavButtons/>
                </div>

                {/*Rework this so that I can accept the ESC key binding here.*/}
                {/*https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it/46123962*/}

                <section className="sidebar"
                         style={sidebarStyle}
                         data-expanded={this.state.expanded}
                         onKeyUp={event => this.onKeyUp(event)}>

                    <div className="subheader p-1" style={Styles.subheader}>

                        <NavButtons/>

                    </div>

                    <ListGroup flush>

                        <RepoSidebarItem id="sidebar-item-documents"
                                         tooltip="Manage all documents you're reading including filtering and sorting."
                                         href="#"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-archive"
                                         text="Documents"/>

                        <RepoSidebarItem id="sidebar-item-annotations"
                                         tooltip="Manage all annotations of all your documents in one central view."
                                         href="#annotations"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-layer-group"
                                         text="Annotations"/>

                        <RepoSidebarItem id="sidebar-item-groups"
                                         tooltip="Show public groups"
                                         href="#groups"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-user-friends"
                                         text="Groups"/>

                        {/*<RepoSidebarItem href="#editors-picks"*/}
                                         {/*onClick={() => this.toggle()}*/}
                                         {/*iconClassName="fas fa-star"*/}
                                         {/*text="Editors Picks"/>*/}

                        <RepoSidebarItem id="sidebar-item-stats"
                                         tooltip="Show stats on your usage of Polar including stats on tags, rate of document addition, etc."
                                         href="#stats"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-chart-line"
                                         text="Statistics"/>

                        <RepoSidebarItem id="sidebar-item-logs"
                                         tooltip="Show logs on internal activity during background operations like cloud activity and sync."
                                         href="#logs"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-info-circle"
                                         text="Logs"/>

                        <RepoSidebarItem id="sidebar-item-support"
                                         tooltip="Get support for Polar."
                                         href="#support"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-hands-helping"
                                         text="Support"/>

                        <RepoSidebarItem id="sidebar-item-upgrade-to-premium"
                                         tooltip="Upgrade to Polar Premium and get the best Polar experience possible."
                                         href="#plans"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-certificate"
                                         text="Upgrade to Premium"/>

                        <RepoSidebarItem id="sidebar-item-whatsnew"
                                         tooltip="Find out what's new with each Polar release."
                                         href="#whats-new"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-bullhorn"
                                         text="Whats New"/>

                    </ListGroup>

                </section>
            </div>

        );

    }

    private onKeyUp(event: React.KeyboardEvent<HTMLElement>) {

        // noop

    }

    private toggle() {

        const expanded = ! this.state.expanded;

        Blackout.toggle(expanded);

        this.setState({
            expanded
        });

        // AppActivities.get().dispatchEvent({name: 'sidebar-toggled', data:
        // {expanded}});

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

