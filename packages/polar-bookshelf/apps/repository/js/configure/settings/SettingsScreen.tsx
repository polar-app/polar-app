import * as React from 'react';
import {useContext} from 'react';
import {DefaultPageLayout} from "../../page_layout/DefaultPageLayout";
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {ConfigureNavbar} from '../ConfigureNavbar';
import {ConfigureBody} from "../ConfigureBody";
import {MUIThemeTypeContext} from "../../../../../web/js/mui/context/MUIThemeTypeContext";
import Divider from '@material-ui/core/Divider';
import {SettingToggle} from './SettingToggle';
import {ViewDeviceInfoButton} from './ViewDeviceInfoButton';
import {SettingSelect} from "./SettingSelect";
import {CancelSubscriptionButton} from "../../premium/CancelSubscriptionButton";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import Box from '@material-ui/core/Box';
import {ManageSubscriptionButton} from "../../premium/ManageSubscriptionButton";
import {FeatureToggle, usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {useLocalStoragePrefs} from "./LocalStoragePrefs";
import {ExportDataButton} from "../../premium/ExportDataButton";
import Button from "@material-ui/core/Button";

export const PREF_PDF_DARK_MODE_OPTIONS = [
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
];

export const SettingsScreen = React.memo(function SettingsScreen() {

    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const localStoragePrefs = useLocalStoragePrefs();

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    };

    return (

        <DefaultPageLayout>
            <ConfigureBody>
                <ConfigureNavbar/>

                <div className="">
                    <h1>General</h1>

                    <h2>
                        General settings. Note that some of
                        these may require you to reload.
                    </h2>

                    <SettingToggle title="Dark Mode"
                                   description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                                   name="dark-mode"
                                   defaultValue={theme === 'dark'}
                                   prefs={prefs}
                                   onChange={handleDarkModeToggle}
                    />

                    <SettingSelect title="PDF Dark Mode Handling"
                                   description="Enable custom dark mode handling for PDFs.  This allows to change how the PDF colors are displayed."
                                   name="dark-mode-pdf"
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

                    <SettingToggle
                        title="Automatically resume reading position"
                        description="This feature restores the document reading position using pagemarks when reopening a document."
                        name="settings-auto-resume"
                        defaultValue={true}
                        prefs={prefs}/>


                    <SettingToggle title="Fixed-width EPUBs"
                                   description="Enables fixed-width EPUBs in desktop mode and limits the document to 800px.  This should make for easier reading for some users."
                                   name="fixed-width-epub"
                                   prefs={prefs}/>

                    {/*<SettingEntry title="Enable groups"*/}
                    {/*              description="Enables the new groups functionality for sharing documents with other users."*/}
                    {/*              name="groups"*/}
                    {/*              prefs={prefs}*/}
                    {/*              preview={true}/>*/}

                    <SettingToggle title="BETA: Automatic pagemarks"
                                   description="Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents."
                                   name={KnownPrefs.AUTO_PAGEMARKS}
                                   prefs={prefs}
                                   preview={true}/>

                    {/*<DeviceRouters.Desktop>*/}
                    {/*    <SettingEntry*/}
                    {/*        title="Table and phone reading"*/}
                    {/*        description="Enabled document reading on tablet and phone devices.  This is currently under development and probably will not work."*/}
                    {/*        name="mobile-reading"*/}
                    {/*        prefs={prefs}*/}
                    {/*        preview={true}/>*/}
                    {/*</DeviceRouters.Desktop>*/}

                    <SettingToggle title="Development"
                                   description="Enables general development features for software engineers working on Polar."
                                   name="dev"
                                   prefs={prefs}
                                   preview={true}/>

                    <Divider/>

                    <Box mt={1}>
                        <MUIButtonBar>
                            <ViewDeviceInfoButton/>
                            <CancelSubscriptionButton/>
                            <ManageSubscriptionButton/>

                            <FeatureToggle featureName="export-data">
                                <ExportDataButton/>
                            </FeatureToggle>

                        </MUIButtonBar>

                        <div style={{
                                 display: 'flex',
                                 marginTop: '5px',
                                 marginBottom: '5px',
                                 justifyContent: 'center'
                             }}>
                            <Button href="https://getpolarized.io/privacy-policy">Privacy Policy</Button>
                            <Button href="https://getpolarized.io/terms">Terms of Service</Button>
                        </div>

                    </Box>

                </div>

            </ConfigureBody>

        </DefaultPageLayout>
    );
});

