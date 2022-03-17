import React from 'react';
import {AccountOverview} from "../../../../apps/repository/js/account_overview/AccountOverview";
import {Analytics} from "../../analytics/Analytics";
import TimelineIcon from '@material-ui/icons/Timeline';
import {EmailStr, URLStr} from "polar-shared/src/util/Strings";
import {Billing} from "polar-accounts/src/Billing";
import {MUIRouterLink} from "../../mui/MUIRouterLink";
import {AccountAvatar} from "./AccountAvatar";
import {memoForwardRefDiv} from "../../react/ReactUtils";
import {useLogoutCallback} from "../../accounts/AccountHooks";
import {Callback} from "polar-shared/src/util/Functions";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import {usePopperController} from "../../mui/menu/MUIPopper";
import {PlanUsage} from "../../apps/repository/accounting/PlanUsage";
import {DeleteAccount} from "./DeleteAccount";
import Subscription = Billing.Subscription;
import {Box, makeStyles, Button, createStyles, IconButton} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import {RoutePathNames} from '../../apps/repository/RoutePathNames';
import {FeatureEnabled} from '../../features/FeaturesRegistry';

interface LogoutButtonProps {
    readonly onLogout: Callback;
}

const LogoutButton = (props: LogoutButtonProps) => {

    return <Button id="cloud-sync-logout"
                   color="secondary"
                   onClick={() => props.onLogout()}>

        Logout

    </Button>;

};

const ViewPlansAndPricingButton = () => {

    const popperController = usePopperController();

    const handler = () => {
        Analytics.event({category: 'premium', action: 'view-plans-and-pricing-button'});
        popperController.dismiss();
    };

    return (
        <MUIRouterLink to='/plans'>
            <Button color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth={true}
                    onClick={handler}>

                <i className="fas fa-certificate"/>
                &nbsp;
                View Plans and Pricing

            </Button>
        </MUIRouterLink>
    );
};


interface IBasicUserInfo {
    readonly photoURL?: URLStr;
    readonly displayName?: string | undefined;
    readonly email?: EmailStr;
    readonly subscription: Subscription;
}

interface IProps {

    readonly userInfo: IBasicUserInfo;

}

export function useLogoutAction(): Callback {

    const dialogs = useDialogManager();

    const logoutCallback = useLogoutCallback();

    return () => {

        dialogs.confirm({
            type: 'danger',
            title: "Are you sure you want to logout?",
            subtitle: "Just wanted to double check. Are you sure you want to logout?",
            onAccept: logoutCallback
        });

    }

}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: 'relative',
            padding: '10px 20px',
        },
        settingsIcon: {
            position: 'absolute',
            top: theme.spacing(0.5),
            right: theme.spacing(0.5),
            padding: theme.spacing(0.75),
            color: theme.palette.text.hint,
        },
    })
);

export const AccountControl = memoForwardRefDiv(function AccountControl(props: IProps, ref) {

    const logoutAction = useLogoutAction();
    const popperController = usePopperController();
    const classes = useStyles();

    const handleLogout = React.useCallback(() => {
        popperController.dismiss();
        logoutAction();
    }, [popperController, logoutAction]);

    return (

        <div data-test-id="AccountControl"
             className={classes.root}
             ref={ref}>

            <MUIRouterLink to={RoutePathNames.SETTINGS}>
                <IconButton className={classes.settingsIcon}>
                    <SettingsIcon />
                </IconButton>
            </MUIRouterLink>

            <div>
                <div className="text-center">

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <AccountAvatar size="large" style={{width: '100px', height: '100px'}}/>
                    </div>

                    <div className="p-1">

                        <div className="text-lg"
                             style={{fontWeight: 'bold'}}>

                            {props.userInfo.displayName || 'Anonymous'}

                        </div>

                        <div className="text-muted text-md"
                             style={{}}>
                            {props.userInfo.email || ''}
                        </div>


                    </div>


                </div>
                <Box display="flex" justifyContent="center" my="0.5rem">
                    <MUIRouterLink to={RoutePathNames.STATISTICS}>
                        <Button variant="outlined"
                                endIcon={<TimelineIcon />}>
                            Statistics
                        </Button>
                    </MUIRouterLink>
                </Box>

                <div className="mt-2 pb-2 border-top text-center">

                    <div className="mt-4 mb-4">
                        <PlanUsage variant='h6'/>
                    </div>

                    <div className="mt-2 mb-4">
                        <AccountOverview subscription={props.userInfo.subscription}/>
                    </div>

                    <div className="mt-2 mb-4">
                        <ViewPlansAndPricingButton/>
                    </div>
                    <FeatureEnabled feature='account-delete'>
                        <div className="mt-2 mb-4">
                            <DeleteAccount/>
                        </div>
                    </FeatureEnabled>
                </div>

                <div className="text-right">

                    <div style={{display: 'flex', whiteSpace: 'nowrap'}}
                         className="mt-2">

                        <div className="ml-auto">
                            {/*<InviteUsersButton/>*/}
                        </div>

                        <div>
                            <LogoutButton onLogout={handleLogout}/>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

});
