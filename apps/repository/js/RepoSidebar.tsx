import * as React from 'react';
import {Button, ListGroup} from 'reactstrap';
import {Logger} from '../../../web/js/logger/Logger';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {Blackout} from './Blackout';
import {NavLogo} from './nav/NavLogo';
import {RepoSidebarItem} from './sidebar/RepoSidebarItem';
import {SimpleTooltip} from '../../../web/js/ui/tooltip/SimpleTooltip';
import {GDPRNotice} from '../../../web/js/ui/gdpr/GDPRNotice';
import {AppActivities} from '../../../web/js/util/AppActivities';

const log = Logger.create();

const Styles: IStyleMap = {

    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        // display: 'none',
        backgroundColor: '#fff',
        zIndex: 999,
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

                <div id="toggle-sidebar"
                     style={{marginTop: 'auto', marginBottom: 'auto'}}>
                    <Button color='light'
                            onClick={() => this.toggle()}>
                        <i className="fas fa-bars"></i>
                    </Button>
                </div>

                <SimpleTooltip target="toggle-sidebar">Toggle showing the sidebar</SimpleTooltip>

                <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                    <NavLogo/>
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
                                         href="#"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-archive"
                                         text="Documents"/>

                        <RepoSidebarItem id="sidebar-item-annotations"
                                         href="#annotations"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-layer-group"
                                         text="Annotations"/>

                        {/*<RepoSidebarItem href="#editors-picks"*/}
                                         {/*onClick={() => this.toggle()}*/}
                                         {/*iconClassName="fas fa-star"*/}
                                         {/*text="Editors Picks"/>*/}

                        <RepoSidebarItem id="sidebar-item-stats"
                                         href="#stats"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-chart-line"
                                         text="Statistics"/>

                        <RepoSidebarItem id="sidebar-item-logs"
                                         href="#logs"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-info-circle"
                                         text="Logs"/>

                        <RepoSidebarItem id="sidebar-item-community"
                                         href="#community"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-hands-helping"
                                         text="Community"/>

                        <RepoSidebarItem id="sidebar-item-whatsnew"
                                         href="#whats-new"
                                         onClick={() => this.toggle()}
                                         iconClassName="fas fa-bullhorn"
                                         text="Whats New"/>

                    </ListGroup>

                    <SimpleTooltip target="sidebar-item-documents"
                                   show={0}
                                   placement="right">

                        Manage all documents you're reading including filtering and sorting.

                    </SimpleTooltip>

                    <SimpleTooltip target="sidebar-item-annotations"
                                   show={0}
                                   placement="right">

                        Manage all annotations of all your documents in one central view.

                    </SimpleTooltip>

                    <SimpleTooltip target="sidebar-item-stats"
                                   show={0}
                                   placement="right">

                        Show stats on your usage of Polar including stats on tags,
                        rate of document addition, etc.

                    </SimpleTooltip>

                    <SimpleTooltip target="sidebar-item-logs"
                                   show={0}
                                   placement="right">

                        Show logs on internal activity during background operations
                        like cloud activity and sync.

                    </SimpleTooltip>

                    <SimpleTooltip target="sidebar-item-community"
                                   show={0}
                                   placement="right">

                        Find community resources including links to discussions around Polar.

                    </SimpleTooltip>

                    <SimpleTooltip target="sidebar-item-whatsnew"
                                   show={0}
                                   placement="right">

                        Find out what's new with each Polar release.

                    </SimpleTooltip>

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

        // AppActivities.get().dispatchEvent({name: 'sidebar-toggled', data: {expanded}});

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

