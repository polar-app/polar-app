import * as React from 'react';
import {useContext} from 'react';
import {MUIThemeTypeContext} from "../../../../../web/js/mui/context/MUIThemeTypeContext";
import {ViewDeviceInfoButton} from './ViewDeviceInfoButton';
import {CancelSubscriptionButton} from "../../premium/CancelSubscriptionButton";
import Box from '@material-ui/core/Box';
import {ManageSubscriptionButton} from "../../premium/ManageSubscriptionButton";
import {usePrefsContext} from "../../persistence_layer/PrefsContext2";
import {ExportDataButton} from "../../premium/ExportDataButton";
import {createStyles, makeStyles, List, ListItem, ListItemIcon, ListItemText, Divider} from "@material-ui/core";
import { ListItemProps } from '@material-ui/core/ListItem';
import DescriptionIcon from "@material-ui/icons/Description";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import {AdaptivePageLayout} from "../../page_layout/AdaptivePageLayout";
import { DeviceRouters } from '../../../../../web/js/ui/DeviceRouter';
import { SettingsMainContent } from './SettingsContent';

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

const Main = () => {

    return (
        <>
            <Box pt={2}>

                <SettingsMainContent/>

                <List>
                    <ViewDeviceInfoButton/>
                    <Divider/>
                    <DeviceRouters.Desktop>
                        <>
                            <CancelSubscriptionButton/>
                            <Divider/>
                            <ManageSubscriptionButton/>
                            <Divider/>
                        </>
                    </DeviceRouters.Desktop>

                    <ExportDataButton/>
                    <Divider/>
                    <ListItemLink href="https://getpolarized.io/privacy-policy">
                        <ListItemIcon>
                        <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Privacy Policy" />
                    </ListItemLink>
                    <Divider/>
                    <ListItemLink href="https://getpolarized.io/terms">
                        <ListItemIcon>
                        <VerifiedUserIcon />
                        </ListItemIcon>
                        <ListItemText primary="Terms of Service" />
                    </ListItemLink>
                </List>

            </Box>
        </>
    );
}
function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}

export const SettingsScreen = React.memo(function SettingsScreen() {

    return (
        <AdaptivePageLayout title="Settings">
            <Main/>
        </AdaptivePageLayout>
    );
});

