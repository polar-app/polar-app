import * as React from "react";
import { SwitchToggle } from "../../repository/js/configure/settings/SettingsToggleSelect";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import {StoryHolder} from "../StoryHolder";
import { Box } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";

export const SettingsStateToggleFunction = () => {

    const onChange = (value: boolean) => {
        console.log("Setting Changed");
    };

    return(
        <Box width={'100%'}>
            <StoryHolder>
                <List subheader={<ListSubheader>Settings</ListSubheader>}>
                    <SwitchToggle title="Dark Mode"
                        description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                        name="dark-mode"
                        icon={<BrightnessMediumIcon />}
                    />

                    <SwitchToggle title="Automatically resume reading position"
                        description="This feature restores the document reading position using pagemarks when reopening a document."
                        name="settings-auto-resume"
                        icon={<FilterCenterFocusIcon />}
                    />
                </List>
            
        </StoryHolder>
        </Box>
        
    );
}