import * as React from 'react';
import { UserAvatar } from '../../../../web/js/ui/cloud_auth/UserAvatar';
import { createStyles, makeStyles, IconButton,Box, Collapse} from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {PlanUsage} from "../../../../web/js/apps/repository/accounting/PlanUsage";

import { HeaderBar } from '../../../../apps/repository/js/doc_repo/HeaderBar';
import { IconByPlan } from '../../../../apps/repository/js/account_overview/PlanIcon';

import {useHistory} from 'react-router-dom';
import {MenuItems} from '../../../../web/js/sidenav/SideNavQuestionButton';
import { useLogoutAction } from '../../../../web/js/ui/cloud_auth/AccountControl';
import { usePopperController } from '../../../../web/js/mui/menu/MUIPopper';
import { RoutePathnames } from './RoutePathnames';

const Chat = MenuItems.Chat;
const Documentation = MenuItems.Documentation;
const RequestFeatures = MenuItems.RequestFeatures;

const useStyles = makeStyles((theme) =>
    createStyles({
        root:{
            display: 'flex',
            width: '100%',
            height:'13%',
            alignItems: 'center'
        },
        mainContainer:{
            height: 'auto',
            overflow: 'auto'
        },
        avatar:{
            marginLeft: '10px',
        },
        icon:{
            marginLeft: 'auto',
            marginRight: '1em'
        },
        details:{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px'
        },
        name:{
            color: '#FFFFFF',
            fontSize: '16px'
        },
        email:{
            color: '#FFFFFF',
            opacity: '54%',
            fontSize:'14px'
        },
        planRow:{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
        },
        sizeRow:{
            display: 'grid',
            gridTemplateColumns: '1fr auto'
        },
        collapsableRow:{
            display: 'flex',
            width:'100%',
            borderTop: '1px solid grey',
            borderBottom: '1px solid grey',
            padding: '10px 20px'
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
        <div className={classes.root}>
            <UserAvatar size={'medium'} className={classes.avatar} photoURL={userInfoContext?.userInfo?.photoURL} displayName={userInfoContext?.userInfo?.displayName}/>
            <div className={classes.details}>
                <span className={classes.name}>{userInfoContext?.userInfo?.displayName}</span>
                <span className={classes.email}>{userInfoContext?.userInfo?.email}</span>
            </div>
            {userInfoContext?.userInfo?.subscription &&
                <IconByPlan className={classes.icon} subscription={userInfoContext?.userInfo?.subscription}/>
            }
        </div>
    );
});

export const PlanDetailsContainer = React.memo(function PlanDetailsContainer(){
    const classes = useStyles();

    return(
        <div className={classes.planRow}>
            <PlanUsage variant={'body2'}/>
        </div>
    );
});
/**
 * a component that we should reuse, 
 * responsible for showing a button/menu items and exapnds/collapses on click
 */
export const Collapsible = React.memo(function Collapsible() {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return(
        <>
            <div className={classes.collapsableRow} onClick={() => setOpen(!open)}>
                <div className={classes.IconAndTitle}>
                    <HelpIcon style={{alignSelf: 'center'}}></HelpIcon>
                    <span style={{alignSelf: 'center', marginLeft: '15px'}}>Help</span>
                </div>
                <IconButton
                    className={classes.collapseIcon}
                    aria-label="expand row"
                    size="small"
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </div>
            <div>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box style={{margin: 1, background: '#444444'}}>                              
                        <Chat/>
                        <Documentation/>
                        <RequestFeatures/>
                    </Box>
                </Collapse>
            </div>
        </>
    );
});
/**
 * a unit component from the preference buttons section 
 */
export const PreferencesButton = React.memo(function PreferencesesButtons(props: IPrefButton) {
    const classes = useStyles();

    return(
        <div className={classes.collapsableRow} onClick={props.goToUrl}>
            <div className={classes.IconAndTitle}>
                {props.icon}
                <span style={{alignSelf: 'center', marginLeft: '15px'}}>{props.title}</span>
            </div>
        </div> 
    );
});

/**
 * Includes: Settings page, Pricing page, Redirecting information (collapsible) 
 * and Logout option 
 */
export const PreferencesButtons = React.memo(function PreferencesesButtons() {
    const classes = useStyles();
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
                    goToUrl={() => history.push(RoutePathnames.SETTINGS_MOBILE)}
                    icon={<SettingsIcon style={{alignSelf: 'center'}} />}    />
            <PreferencesButton  
                title={'Upgrade Plan'} 
                goToUrl={() => history.push(RoutePathnames.PLAN_MOBILE)}
                icon={<MonetizationOnIcon style={{alignSelf: 'center'}} />}   />
   
            <Collapsible/>

            <PreferencesButton  
                    title={'Log out'} 
                    goToUrl={ () => handleLogout()}
                    icon={<ExitToAppIcon style={{alignSelf: 'center'}} />}   />
            
        </>
    );
});

/**
 * The content of the account page
 */
export const AccountPageMobile = React.memo(function AccountPageMobile() {
    const classes = useStyles();
    return(
        <>
            <HeaderBar title={'Preferences'}/>
            <div className={classes.mainContainer}>
                <UserDetailsRow/>
                <PlanDetailsContainer/>   
                <PreferencesButtons/>
            </div>
        </>
    );
});
