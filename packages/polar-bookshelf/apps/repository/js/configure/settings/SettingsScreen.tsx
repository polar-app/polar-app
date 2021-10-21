import * as React from 'react';
import {useContext} from 'react';
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {MUIThemeTypeContext} from "../../../../../web/js/mui/context/MUIThemeTypeContext";
import Divider from '@material-ui/core/Divider';
import {SettingToggle} from './SettingToggle';
import {ViewDeviceInfoButton} from './ViewDeviceInfoButton';
import {SettingSelect} from "./SettingSelect";
import {CancelSubscriptionButton} from "../../premium/CancelSubscriptionButton";
import Box from '@material-ui/core/Box';
import {ManageSubscriptionButton} from "../../premium/ManageSubscriptionButton";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {ExportDataButton} from "../../premium/ExportDataButton";
import {createStyles, makeStyles} from "@material-ui/core";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import DescriptionIcon from "@material-ui/icons/Description";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import {FullWidthButton} from './FullWidthButton';
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import { DeviceRouters } from '../../../../../web/js/ui/DeviceRouter';

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

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // margin: '16px 0',
            '& h1, & h2, & h3, & h4, & h5': {
                margin: 0,
            },
            height: '100%',
            overflow: 'auto'
        },
    }),
);

const Main = () => {

    const classes = useStyles();
    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    };

    return (
        <>
            <div className={classes.root}>

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

                <Divider/>

                <Box mt={1} mx={1}>
                    <ViewDeviceInfoButton/>
                    <Divider/>

                    <DeviceRouters.Desktop>
                        <>
                            <CancelSubscriptionButton/>
                            <ManageSubscriptionButton/>
                        </>
                    </DeviceRouters.Desktop>

                    <ExportDataButton/>
                    <Divider/>

                    <a target="_blank" style={{ textDecoration: 'none' }} href="https://getpolarized.io/privacy-policy">
                        <FullWidthButton icon={<DescriptionIcon />}>
                            Privacy Policy
                        </FullWidthButton>
                    </a>
                    <Divider/>
                    <a target="_blank" style={{ textDecoration: 'none' }} href="https://getpolarized.io/terms">
                        <FullWidthButton icon={<VerifiedUserIcon />}>
                            Terms of Service
                        </FullWidthButton>
                    </a>
                </Box>

            </div>
        </>
    );
}

export const SettingsScreen = React.memo(function SettingsScreen() {

    return (
        <AdaptivePageLayout title="Settings">
            <Main/>
        </AdaptivePageLayout>
    );
});

