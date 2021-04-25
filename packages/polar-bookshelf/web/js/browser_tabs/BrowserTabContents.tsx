import React from 'react';
import isEqual from 'react-fast-compare';
import {useBrowserTabsStore} from './BrowserTabsStore';

interface BrowserTabContentProps {
    readonly active: boolean;
    readonly children: React.ReactNode;
}

const BrowserTabContent = React.memo(function BrowserTabContent(props: BrowserTabContentProps) {

    const {active} = props;

    const display = active ? 'flex' : 'none';

    return (
        <div className="BrowserTabContents"
             style={{
                 display,
                 minHeight: 0,
                 flexDirection: 'column',
                 flexGrow: 1
             }}>

            {props.children}

        </div>
    )

}, isEqual)


export const BrowserTabContents = React.memo(function BrowserTabContents() {

    const {activeTab, tabs} = useBrowserTabsStore(['activeTab', 'tabs']);

    return (
        <>
            {tabs.map((tab, tabIndex) => tab.component &&
                <BrowserTabContent key={tab.url}
                                   active={activeTab === tabIndex}>
                    {tab.component}
                </BrowserTabContent>)}
        </>
    );

});
