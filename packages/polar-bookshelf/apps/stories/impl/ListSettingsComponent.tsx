import * as React from "react";
import { SwitchToggle } from "../../repository/js/configure/settings/SettingsToggle2";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import {StoryHolder} from "../StoryHolder";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import { SwitchSelect } from "../../repository/js/configure/settings/SettingSelect2";
import {RadioGroup} from "@material-ui/core";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";

export const SettingsStateToggleFunction = () => {

    const onChange = (value: boolean) => {
        console.log("Setting Changed");
    };

    return(
            <StoryHolder>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                    <SwitchToggle title="Dark Mode"
                        description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                        name="dark-mode"
                        icon={<BrightnessMediumIcon />}
                    />

                <SwitchSelect title="PDF Dark Mode Handling"
                    description="Enable custom dark mode handling for PDFs.  This allows to change how the PDF colors are displayed."
                    name="dark-mode-pdf"
                    icon={<ImportContactsIcon />}
                    options={[
                        {
                            id: 'invert',
                            label: 'Invert PDF colors to dark'
                        },
                        {
                            id: 'invert-greyscale',
                            label: 'Invert PDF colors to dark (greyscale)'
                        },
                        {
                            id: 'natural',
                            label: 'Use the natural colors of the PDF'
                        }
                ]}/>

                    <SwitchToggle title="Automatically resume reading position"
                        description="This feature restores the document reading position using pagemarks when reopening a document."
                        name="settings-auto-resume"
                        icon={<FilterCenterFocusIcon />}
                    />

                    <SwitchToggle title="Fixed-width EPUBs"
                        description="Enables fixed-width EPUBs in desktop mode and limits the document to 800px."
                        name="fixed-width-epub"
                        icon={<HeightIcon style={{ transform: 'rotate(90deg)' }} />}
                    />
                </List>
            
        </StoryHolder>
        
    );
}