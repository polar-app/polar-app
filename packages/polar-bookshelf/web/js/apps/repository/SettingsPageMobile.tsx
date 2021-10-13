import * as React from 'react';
import {useContext} from 'react';
import Divider from '@material-ui/core/Divider';
import {Box, createStyles, makeStyles} from "@material-ui/core";
import { MUIThemeTypeContext } from '../../../../web/js/mui/context/MUIThemeTypeContext';
import { DefaultPageLayout } from '../../../../apps/repository/js/page_layout/DefaultPageLayout';
import { SettingToggle } from '../../../../apps/repository/js/configure/settings/SettingToggle';

//icons
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import DescriptionIcon from "@material-ui/icons/Description";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

import { usePrefsContext } from '../../../../apps/repository/js/persistence_layer/PrefsContext2';
import { HeaderBar } from '../../../../apps/repository/js/doc_repo/HeaderBar';
import { SettingSelect } from '../../../../apps/repository/js/configure/settings/SettingSelect';
import { KnownPrefs } from '../../../../web/js/util/prefs/KnownPrefs';
import { ViewDeviceInfoButton } from '../../../../apps/repository/js/configure/settings/ViewDeviceInfoButton';
import { CancelSubscriptionButton } from '../../../../apps/repository/js/premium/CancelSubscriptionButton';
import { ManageSubscriptionButton } from '../../../../apps/repository/js/premium/ManageSubscriptionButton';
import { ExportDataButton } from '../../../../apps/repository/js/premium/ExportDataButton';
import { FullWidthButton } from '../../../../apps/repository/js/configure/settings/FullWidthButton';

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


export const SettingsPageMobile = React.memo(function SettingsPageMobile() {
    const classes = useStyles();
    const {theme, setTheme} = useContext(MUIThemeTypeContext);
    const prefs = usePrefsContext();

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    };
    

    return(
        <DefaultPageLayout>
            <HeaderBar title='General settings'/>
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
            <SettingToggle title="Automatically resume reading position"
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
            <SettingToggle title="Automatic pagemarks"
                            description="Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents."
                            name={KnownPrefs.AUTO_PAGEMARKS}
                            prefs={prefs}
                            icon={<BookmarkIcon />}
                            preview={true}/>
            <Divider/>
            <SettingToggle title="Development"
                                   description="Enables general development features for software engineers working on Polar."
                                   icon={<DeveloperModeIcon />}
                                   name="dev"
                                   prefs={prefs}
                                   preview={true}/>
            <Divider/>

            <Box mt={1}>
                <ViewDeviceInfoButton/>
                <Divider/>
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
        </DefaultPageLayout>
    );
});