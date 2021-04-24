import React from 'react';
import {useBrowserTabsCallbacks, useBrowserTabsStore} from "./BrowserTabsStore";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {useHistory} from 'react-router-dom';
import {DragBar} from "./DragBar";

export const BrowserTabsList = React.memo(function BrowserTabsList() {

    const {activeTab, tabs} = useBrowserTabsStore(['activeTab', 'tabs']);
    const {setActiveTab} = useBrowserTabsCallbacks();
    const history = useHistory();

    const handleChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {

        const tab = tabs[tabIndex];

        if (tab) {
            setActiveTab(tabIndex);
            console.log("Changing navigation to: " + tab.url);
            history.replace(tab.url);
        } else {
            console.warn("No tab for ID: " + tabIndex);
        }

    };

    return (
        <div style={{paddingLeft: '70px'}}>
            <>
                <DragBar/>
                <Tabs value={activeTab}
                      indicatorColor="primary"
                      textColor="inherit"
                      variant="standard"
                      onChange={handleChange}>

                    {tabs.map((tab, tabIndex) => (
                        <Tab key={tabIndex}
                             draggable={false}
                             id={'' + tabIndex}
                             disableFocusRipple
                             disableRipple
                             label={tab.title}/>
                    ))}

                </Tabs>
            </>

        </div>
    );

});
