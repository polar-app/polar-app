import * as React from 'react';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {NavLogo} from './nav/NavLogo';
import {GDPRNotice} from '../../../web/js/ui/gdpr/GDPRNotice';
import {SimpleTabs} from "../../../web/js/ui/simple_tab/SimpleTabs";
import {SimpleTab} from "../../../web/js/ui/simple_tab/SimpleTab";

const Styles: IStyleMap = {

    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        // display: 'none',
        backgroundColor: '#fff',
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

        const NavButtons = () => (

            <div style={{display: 'flex'}}>

                <div className="mt-auto mb-auto">
                    <NavLogo/>
                </div>

                <div className="mt-auto mb-auto d-none-mobile">

                    <div className="ml-4">
                        <SimpleTabs>
                            <SimpleTab id="nav-tab-document-repository" target={{pathname: "/", hash: "#"}} text="Document Repository"/>
                            <SimpleTab id="nav-tab-annotations" target={{pathname: "/", hash: "#annotations"}} text="Annotations"/>
                            <SimpleTab id="nav-tab-statistics" target={{pathname: "/", hash: "#stats"}} text="Statistics"/>
                            <SimpleTab id="nav-tab-groups" target={{pathname: "/groups"}} text="Groups"/>
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
                         data-expanded={this.state.expanded}>

                    <div className="subheader" style={Styles.subheader}>

                        <NavButtons/>

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

