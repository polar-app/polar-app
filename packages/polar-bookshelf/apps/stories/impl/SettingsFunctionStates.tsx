import * as React from "react";
import { ThemeToggle } from "../../../apps/repository/js/configure/settings/SettingsContent"
import { SettingToggle } from "../../../apps/repository/js/configure/settings/SettingToggle";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import {MUIThemeTypeContext} from "../../../web/js/mui/context/MUIThemeTypeContext";
import {useContext} from 'react';
import { usePrefsContext } from "../../../apps/repository/js/persistence_layer/PrefsContext2";
import { Box } from "@material-ui/core";
import {StoryHolder} from "../StoryHolder";

export const SettingsStateStory = () => {

    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    };

    return(
        <StoryHolder>
            <Box>
            <SettingToggle title="Dark Mode"
                description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                name="dark-mode"
                icon={<BrightnessMediumIcon />}
                defaultValue={theme === 'dark'}
                prefs={prefs}
                onChange={handleDarkModeToggle}
                />
            </Box>
        </StoryHolder>

        );
}