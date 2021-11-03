import * as React from 'react';
import Box from '@material-ui/core/Box';
import {MUIThemeTypeContext} from "../../../../../web/js/mui/context/MUIThemeTypeContext";
import {useContext} from 'react';
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {SettingSelect} from "./SettingSelect";
import {SettingToggle} from './SettingToggle';
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import {List, Divider} from "@material-ui/core";

export const SettingsMainContent = () => {

    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';
        setTimeout(() => setTheme(theme), 1);
    };

    return(
        <Box>
            <List>
                <SettingToggle title="Dark Mode"
                                description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                                name="dark-mode"
                                icon={<BrightnessMediumIcon />}
                                defaultValue={theme === 'dark'}
                                prefs={prefs}
                                onChange={handleDarkModeToggle}
                />
                <Divider/>
                <SettingSelect title="PDF Dark Mode Handling"
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
                <Divider/>
                <SettingToggle
                    title="Automatically resume reading position"
                    description="This feature restores the document reading position using pagemarks when reopening a document."
                    name="settings-auto-resume"
                    icon={<FilterCenterFocusIcon />}
                    defaultValue={true}
                    prefs={prefs}/>

                <Divider/>
                <SettingToggle title="Fixed-width EPUBs"
                                description="Enables fixed-width EPUBs in desktop mode and limits the document to 800px.  This should make for easier reading for some users."
                                name="fixed-width-epub"
                                icon={<HeightIcon style={{ transform: 'rotate(90deg)' }} />}
                                prefs={prefs}/>
                <Divider/>
                {/*<SettingEntry title="Enable groups"*/}
                {/*              description="Enables the new groups functionality for sharing documents with other users."*/}
                {/*              name="groups"*/}
                {/*              prefs={prefs}*/}
                {/*              preview={true}/>*/}
                {/* <Divider/> */}
                <SettingToggle title="Automatic pagemarks"
                                description="Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents."
                                name={KnownPrefs.AUTO_PAGEMARKS}
                                prefs={prefs}
                                icon={<BookmarkIcon />}
                                preview={true}/>
                <Divider/>
                {/*<DeviceRouters.Desktop>*/}
                {/*    <SettingEntry*/}
                {/*        title="Table and phone reading"*/}
                {/*        description="Enabled document reading on tablet and phone devices.  This is currently under development and probably will not work."*/}
                {/*        name="mobile-reading"*/}
                {/*        prefs={prefs}*/}
                {/*        preview={true}/>*/}
                {/*</DeviceRouters.Desktop>*/}
                {/* <Divider/> */}

                <SettingToggle title="Development"
                                description="Enables general development features for software engineers working on Polar."
                                icon={<DeveloperModeIcon />}
                                name="dev"
                                prefs={prefs}
                                preview={true}/>
            </List>
            <Divider/>
        </Box>
    );
}