import * as React from 'react';
import { UserAvatar } from '../../../../web/js/ui/cloud_auth/UserAvatar';
import { createStyles, makeStyles,Box, Collapse, Button, Paper} from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {PlanUsage} from "../../../../web/js/apps/repository/accounting/PlanUsage";
import { IconByPlan } from '../../../../apps/repository/js/account_overview/PlanIcon';
import {useHistory} from 'react-router-dom';
import {MenuItems} from '../../../../web/js/sidenav/SideNavQuestionButton';
import { useLogoutAction } from '../../../../web/js/ui/cloud_auth/AccountControl';
import { usePopperController } from '../../../../web/js/mui/menu/MUIPopper';
import { RoutePathNames } from './RoutePathNames';
import {AdaptivePageLayout} from "../../../../apps/repository/js/page_layout/AdaptivePageLayout";

const Chat = MenuItems.Chat;
const Documentation = MenuItems.Documentation;
const RequestFeatures = MenuItems.RequestFeatures;

const useStyles = makeStyles((theme) =>
    createStyles({
        root:{
            display: 'flex',
            height:'13%',
            alignItems: 'center'
        },
        avatar:{
            marginLeft: theme.spacing(1),
        },
        icon:{
            marginLeft: 'auto',
            marginRight: theme.spacing(1),
        },
        details:{
            display: 'flex',
            flexDirection: 'column'
        },
        planRow:{
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(2),
        },
        sizeRow:{
            display: 'grid',
            gridTemplateColumns: '1fr auto'
        },
        collapsableRow:{
            display: 'flex',
            justifyContent: 'flex-start',
            width:'100%',
            borderTop: '1px solid grey',
            borderBottom: '1px solid grey',
            padding: theme.spacing(2),
        },
        IconAndTitle:{
            display: 'flex',
            alignContent: 'center'
        },
        collapseIcon:{
            marginLeft: 'auto'
        }
    })
);

interface IPrefButton{
    readonly title: string;
    readonly icon: any;
    readonly goToUrl: React.MouseEventHandler;
}
/**
 * The user details row: avatar, name and email and the user's plan
 */
export const UserDetailsRow = React.memo(function UserDetailsRow(){

    const classes = useStyles();
    const userInfoContext = useUserInfoContext();

    return(
        <Box ml={1} pr={1} className={classes.root}>
            <UserAvatar size={'medium'} className={classes.avatar} photoURL={userInfoContext?.userInfo?.photoURL} displayName={userInfoContext?.userInfo?.displayName}/>
            <Box component='div' ml={1} className={classes.details}>
                <Box component='span' color='text.primary'>{userInfoContext?.userInfo?.displayName}</Box>
                <Box component='span' color='text.secondary'>{userInfoContext?.userInfo?.email}</Box>
            </Box>
            {userInfoContext?.userInfo?.subscription &&
                <IconByPlan className={classes.icon} subscription={userInfoContext?.userInfo?.subscription}/>
            }
        </Box>
    );
});

export const PlanDetailsContainer = React.memo(function PlanDetailsContainer(){
    const classes = useStyles();

    return(
        <Box component='div' className={classes.planRow}>
            <PlanUsage variant={'body2'}/>
        </Box>
    );
});
/**
 * a component that we should reuse,
 * responsible for showing a button/menu items and exapnds/collapses on click
 */
export const CollapsibleHelpSection = React.memo(function Collapsible() {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return(
        <>
            <Button className={classes.collapsableRow} onClick={() => setOpen(!open)}>
                <div style={{display: 'flex', alignContent: 'center'}}>
                    <HelpIcon/>
                    <Box component='span' ml={3}>Help</Box>
                </div>
                <div className={classes.collapseIcon} aria-label="expand row">
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Paper>
                    <Chat/>
                    <Documentation/>
                    <RequestFeatures/>
                </Paper>
            </Collapse>
        </>
    );
});
/**
 * a unit component from the preference buttons section
 */
export const PreferencesButton = React.memo(function PreferencesButton(props: IPrefButton) {
    const classes = useStyles();

    return(
        <Button className={classes.collapsableRow} onClick={props.goToUrl}>
            {props.icon}
            <Box component='span' ml={3}>{props.title}</Box>
        </Button>
    );
});

/**
 * Includes: Settings page, Pricing page, Redirecting information (collapsible)
 * and Logout option
 */
export const PreferencesButtons = React.memo(function PreferencesesButtons() {
    const history = useHistory();

    const logoutAction = useLogoutAction();
    const popperController = usePopperController();

    function handleLogout() {
        popperController.dismiss();
        logoutAction();
    }

    return(
        <>
            <PreferencesButton
                    title={'Settings'}
                    goToUrl={() => history.push(RoutePathNames.SETTINGS_MOBILE)}
                    icon={<SettingsIcon/>}    />

            <PreferencesButton
                title={'Upgrade Plan'}
                goToUrl={() => history.push(RoutePathNames.PLAN_MOBILE)}
                icon={<MonetizationOnIcon/>}   />

            <CollapsibleHelpSection/>

            <PreferencesButton
                    title={'Log out'}
                    goToUrl={ () => handleLogout()}
                    icon={<ExitToAppIcon />}   />

        </>
    );
});

/**
 * The content of the account page
 */
export const AccountPageMobile = React.memo(function AccountPageMobile() {
    return(
        <>
            <AdaptivePageLayout title="Account">
                <Box pt={1}>
                    <UserDetailsRow/>
                    <PlanDetailsContainer/>
                    <PreferencesButtons/>
                </Box>
            </AdaptivePageLayout>
        </>
    );
});
