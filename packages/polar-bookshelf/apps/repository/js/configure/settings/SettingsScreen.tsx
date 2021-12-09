import * as React from 'react';
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {SettingListItem} from './SettingListItem';
import {ViewDeviceInfoButton} from './ViewDeviceInfoButton';
import {SettingSelect} from "./SettingSelect";
import {CancelSubscriptionButton} from "../../premium/CancelSubscriptionButton";
import Box from '@material-ui/core/Box';
import {ManageSubscriptionButton} from "../../premium/ManageSubscriptionButton";
import {ExportDataListItem} from "../../premium/ExportDataListItem";
import {createStyles, makeStyles, List} from "@material-ui/core";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import DescriptionIcon from "@material-ui/icons/Description";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import { DeviceRouters } from '../../../../../web/js/ui/DeviceRouter';
import { ListItemLinkButton } from './ListItemLinkButton';

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

    return (
        <Box pt={1} className={classes.root}>
            <List>
                <SettingListItem title="Dark Mode"
                                 description="Enable dark mode which is easier on the eyes in low light environments and just looks better."
                                 name="dark-mode"
                                 defaultValue={true}
                                 icon={<BrightnessMediumIcon />}/>
                <SettingSelect title="PDF Dark Mode Handling"
                                description="Enable custom dark mode handling for PDFs.  This allows to change how the PDF colors are displayed."
                                name="dark-mode-pdf"
                                icon={<ImportContactsIcon />}
                                options={PREF_PDF_DARK_MODE_OPTIONS}/>
                <SettingListItem
                    title="Automatically resume reading position"
                    description="This feature restores the document reading position using pagemarks when reopening a document."
                    name="settings-auto-resume"
                    icon={<FilterCenterFocusIcon />}
                    defaultValue={true}/>
                <SettingListItem title="Fixed-width EPUBs"
                                 description="Enables fixed-width EPUBs in desktop mode and limits the document to 800px.  This should make for easier reading for some users."
                                 name="fixed-width-epub"
                                 icon={<HeightIcon style={{ transform: 'rotate(90deg)' }} />}/>
                {/*<SettingEntry title="Enable groups"*/}
                {/*              description="Enables the new groups functionality for sharing documents with other users."*/}
                {/*              name="groups"*/}
                {/*              prefs={prefs}*/}
                {/*              preview={true}/>*/}
                <SettingListItem title="Automatic pagemarks"
                                 description="Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents."
                                 name={KnownPrefs.AUTO_PAGEMARKS}
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

                <SettingListItem title="Development"
                                 description="Enables general development features for software engineers working on Polar."
                                 icon={<DeveloperModeIcon />}
                                 name="dev"
                                 preview={true}/>
                <ViewDeviceInfoButton/>
                <DeviceRouters.Desktop>
                    <>
                        <CancelSubscriptionButton/>
                        <ManageSubscriptionButton/>
                    </>
                </DeviceRouters.Desktop>
                <ExportDataListItem/>
                <ListItemLinkButton icon={<DescriptionIcon/>} text={"Privacy Policy"} href={'https://getpolarized.io/privacy-policy'}/>
                <ListItemLinkButton icon={<VerifiedUserIcon/>} text={"Terms of Service"} href={'https://getpolarized.io/terms'}/>
            </List>
        </Box>
    );
}

export const SettingsScreen = React.memo(function SettingsScreen() {

    return (
        <AdaptivePageLayout title="Settings">
            <Main/>
        </AdaptivePageLayout>
    );
});
