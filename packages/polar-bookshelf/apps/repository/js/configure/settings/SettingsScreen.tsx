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
import {createStyles, makeStyles} from "@material-ui/core";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import InfoIcon from "@material-ui/icons/Info";
import {FullWidthButton} from './FullWidthButton';

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

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            margin: '16px 0',
            '& h1, & h2, & h3, & h4, & h5': {
                margin: 0,
            }
        },
        padded: {
            margin: '0 16px'
        }
    }),
);

export const SettingsScreen = React.memo(function SettingsScreen() {
    const classes = useStyles();
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

                <div className={classes.root}>
                    <div className={classes.padded}>
                        <h1>General</h1>

                        <p>
                            General settings. Note that some of
                            these may require you to reload.
                        </p>
                    </div>

                    <SettingToggle title="Dark Mode"
                                   description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                                   name="dark-mode"
                                   icon={<BrightnessMediumIcon />}
                                   defaultValue={theme === 'dark'}
                                   prefs={prefs}
                                   onChange={handleDarkModeToggle}
                    />

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

                    <SettingToggle
                        title="Automatically resume reading position"
                        description="This feature restores the document reading position using pagemarks when reopening a document."
                        name="settings-auto-resume"
                        icon={<FilterCenterFocusIcon />}
                        defaultValue={true}
                        prefs={prefs}/>


                    <SettingToggle title="Fixed-width EPUBs"
                                   description="Enables fixed-width EPUBs in desktop mode and limits the document to 800px.  This should make for easier reading for some users."
                                   name="fixed-width-epub"
                                   icon={<HeightIcon style={{ transform: 'rotate(90deg)' }} />}
                                   prefs={prefs}/>

                    {/*<SettingEntry title="Enable groups"*/}
                    {/*              description="Enables the new groups functionality for sharing documents with other users."*/}
                    {/*              name="groups"*/}
                    {/*              prefs={prefs}*/}
                    {/*              preview={true}/>*/}

                    <SettingToggle title="Automatic pagemarks"
                                   description="Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents."
                                   name={KnownPrefs.AUTO_PAGEMARKS}
                                   prefs={prefs}
                                   icon={<BookmarkIcon />}
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
                                   icon={<DeveloperModeIcon />}
                                   name="dev"
                                   prefs={prefs}
                                   preview={true}/>

                    <Divider/>

                    <Box mt={1}>
                        <ViewDeviceInfoButton/>
                        <CancelSubscriptionButton/>
                        <ManageSubscriptionButton/>

                        <ExportDataButton/>


                         <a target="_blank" style={{ textDecoration: 'none' }} href="https://getpolarized.io/privacy-policy">
                             <FullWidthButton>
                                 Privacy Policy
                             </FullWidthButton>
                         </a>
                         <a target="_blank" style={{ textDecoration: 'none' }} href="https://getpolarized.io/terms">
                             <FullWidthButton>
                                 Terms of Service
                             </FullWidthButton>
                         </a>
                    </Box>

                </div>

            </ConfigureBody>

        </DefaultPageLayout>
    );
});

