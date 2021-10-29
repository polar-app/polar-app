import * as React from 'react';
import {UserAvatar} from '../../ui/cloud_auth/UserAvatar';
import {Box, Collapse, createStyles, List, ListItem, ListItemText, ListItemIcon, makeStyles, Paper, Divider} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useUserInfoContext} from "./auth_handler/UserInfoProvider";
import {PlanUsage} from "./accounting/PlanUsage";
import {IconByPlan} from '../../../../apps/repository/js/account_overview/PlanIcon';
import {useHistory} from 'react-router-dom';
import {MenuItems} from '../../sidenav/SideNavQuestionButton';
import {useLogoutAction} from '../../ui/cloud_auth/AccountControl';
import {usePopperController} from '../../mui/menu/MUIPopper';
import {RoutePathNames} from './RoutePathNames';
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
    })
);
/**
 * The user details row: avatar, name and email and the user's plan
 */
export const UserDetailsRow = React.memo(function UserDetailsRow(){

    const classes = useStyles();
    const userInfoContext = useUserInfoContext();

    return(
        <Box ml={1} pr={1} className={classes.root}>
            <UserAvatar size={'medium'} className={classes.avatar}/>
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
 * Includes: Settings page, Pricing page, Redirecting information (collapsible)
 * and Logout option
 */
export const PreferencesListItems = React.memo(function PreferencesListItems() {
    const [open, setOpen] = React.useState(false);

    const history = useHistory();
    const logoutAction = useLogoutAction();
    const popperController = usePopperController();
    
    const handleClick = () => {
        setOpen(!open);
    };
    function handleLogout() {
        popperController.dismiss();
        logoutAction();
    }

    return(
        <List>      
            <Divider />
            <ListItem button onClick={() => history.push(RoutePathNames.SETTINGS)}>
                <ListItemIcon>
                <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => history.push(RoutePathNames.PLANS)}>
                <ListItemIcon>
                <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Upgrade Plan" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help" />
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Paper style={{width: '100%'}}>
                        <Chat/>
                        <Divider />
                        <Documentation/>
                        <Divider />
                        <RequestFeatures/>
                    </Paper>
                </List>
            </Collapse>
            <Divider />
            <ListItem button onClick={() => handleLogout()}>
                <ListItemIcon>
                <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Log out" />
            </ListItem>
            <Divider />
        </List>
    );
});

/**
 * The content of the account page
 */
export const AccountPageMobile = React.memo(function AccountPageMobile() {
    return(
        <>
            <AdaptivePageLayout title="Account">
                <Box pt={2}>
                    <UserDetailsRow/>
                    <PlanDetailsContainer/>
                    <PreferencesListItems/>
                </Box>
            </AdaptivePageLayout>
        </>
    );
});
