import * as React from 'react';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import {ChannelBinder} from '../../js/util/Channels';

let tabSequence: number = 10000;

// TODO
//
// - context menu
// - close button
// - ability to add content externally
// - fit the screen properly including the webview content

export class TabNav extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.addTab = this.addTab.bind(this);

        this.props.addTabBinder(tab => this.addTab(tab));

        this.state = {
            activeTab: 0,
            tabs: [
                {
                    id: 0,
                    title: "First tab",
                    content: <div>This is the first page content</div>
                },
                {
                    id: 1,
                    title: "Second tab",
                    content: 'http://cnn.com'
                },
            ]
        };

    }

    public render() {

        const NavTabs = () => {

            return <Nav tabs>

                {this.state.tabs.map(tab =>

                    <NavItem key={tab.id}>
                        <NavLink
                            className={"p-1 pl-2 pr-2 " + (tab.id === this.state.activeTab ? "active" : "")}
                            onClick={() => this.toggle(tab.id)}>
                            {tab.title}
                        </NavLink>
                    </NavItem>

                   )}

            </Nav>;

        };

        // the actual body of the tabs
        const Tabs = () => {

            return <TabContent activeTab={this.state.activeTab}>

                {this.state.tabs.map(tab => {

                        const TabBody = () => {

                            if (typeof tab.content === 'string') {
                                return <div>this is external content</div>;
                            } else {
                                return tab.content;
                            }

                        };

                        return <TabPane tabId={tab.id} key={tab.id}>
                            <TabBody/>
                        </TabPane>;

                    })

                };

            </TabContent>;

        };

        return (

            <div className="tab-nav">

                <NavTabs/>

                <Tabs/>

            </div>

        );

    }

    private addTab(tab: TabInit) {

        const newTab = {
            ...tab,
            id: tabSequence++
        };

        this.setState({...this.state, tabs: [...this.state.tabs, newTab]});

    }

    private toggle(tab: number) {

        if (this.state.activeTab !== tab) {
            this.setState({...this.state, activeTab: tab});
        }

    }

}


interface IProps {
    readonly addTabBinder: ChannelBinder<TabInit>;
}

interface IState {
    readonly activeTab: number;
    readonly tabs: ReadonlyArray<Tab>;
}

export interface TabInit {

    readonly title: string;

    /**
     * What we should be displaying in the tab.
     */
    readonly content: JSX.Element | string;

}

/**
 * Our high level interface for a tab
 */
export interface Tab extends TabInit {

    readonly id: number;

}

/**
 * Used to load content externally via a WebView but I need to figure out if
 * this is even doable but I think if I set the height as 100vh that it will
 * work properly.
 */
class ExternalContent {

    constructor(public readonly href: string) {

    }
}
