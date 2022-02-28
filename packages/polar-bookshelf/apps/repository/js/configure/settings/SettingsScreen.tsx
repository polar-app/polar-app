import * as React from 'react';
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {SettingListItem} from './SettingListItem';
import {ViewDeviceListItem} from './ViewDeviceListItem';
import {SettingSelect} from "./SettingSelect";
import {CancelSubscriptionButton} from "../../premium/CancelSubscriptionButton";
import Box from '@material-ui/core/Box';
import {ManageSubscriptionButton} from "../../premium/ManageSubscriptionButton";
import {ExportDataListItem} from "./ExportDataListItem";
import {createStyles, List, ListItem, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import HeightIcon from "@material-ui/icons/Height";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import DescriptionIcon from "@material-ui/icons/Description";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import {DeviceRouters} from '../../../../../web/js/ui/DeviceRouter';
import {ListItemLinkButton} from './ListItemLinkButton';
import {useHistory} from "react-router-dom";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import {Feature} from '../../../../../web/js/features/FeaturesRegistry';
import {SpacedRepetitionPurgeListItem} from "./SpacedRepetitionPurgeListItem";
import {WhenAccountLevel} from "./WhenAccountLevel";
import {Alert} from "@material-ui/lab";
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

export const UserReferralListItem = React.memo(function UserReferralListItem() {

    const history = useHistory();

    const handleClick = React.useCallback(() => {
        history.push("/settings/user-referral")
    }, [history]);

    return (
        <ListItem button
                  onClick={handleClick}>
            <ListItemIcon>
                <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="User Referral" />
        </ListItem>
    );

});


export const FeaturesListItem = React.memo(function FeaturesListItem() {

    const history = useHistory();

    const handleClick = React.useCallback(() => {
        history.push("/features")
    }, [history]);

    return (
        <ListItem data-test-id="FeaturesListItem"
                  button
                  onClick={handleClick}>
            <ListItemIcon>
                <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="Features" />
        </ListItem>
    );

});

const GetFreePolar = () => {

    const history = useHistory();

    return (
        <Alert variant="filled"
               severity="info"
               action={
                   <Button variant="contained" onClick={() => history.push("/settings/user-referral")}>
                       GET FREE POLAR
                   </Button>
               }
               style={{fontSize: '16px'}}>
            <b>Get Free Polar Premium</b> When you Refer a Student Friend
        </Alert>
    )
}

const Main = () => {

    const classes = useStyles();

    return (
        <Box data-test-id="Main" pt={1} className={classes.root}>

            <WhenAccountLevel ver="v2">
                <GetFreePolar/>
            </WhenAccountLevel>

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
                <ViewDeviceListItem/>
                <DeviceRouters.Desktop>
                    <>
                        <CancelSubscriptionButton/>
                        <ManageSubscriptionButton/>
                    </>
                </DeviceRouters.Desktop>
                <ExportDataListItem/>

                <Feature feature='features' enabled={<FeaturesListItem/>}/>

                <ListItemLinkButton icon={<DescriptionIcon/>} text={"Privacy Policy"} href={'https://getpolarized.io/privacy-policy'}/>
                <ListItemLinkButton icon={<VerifiedUserIcon/>} text={"Terms of Service"} href={'https://getpolarized.io/terms'}/>

                <Feature feature='spaced-rep-purge' enabled={<SpacedRepetitionPurgeListItem/>}/>

            </List>
        </Box>
    );
}

export const SettingsScreen = React.memo(function SettingsScreen() {

    return (
        <AdaptivePageLayout data-test-id="SettingsScreen"
                            title="Settings">
            <Main/>
        </AdaptivePageLayout>
    );
});
