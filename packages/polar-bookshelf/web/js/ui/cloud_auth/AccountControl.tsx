import React from 'react';
import {AccountOverview} from "../../../../apps/repository/js/account_overview/AccountOverview";
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";
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
import {AcceptBatch} from "./AcceptBatch";
import Subscription = Billing.Subscription;
import {createIntercomClient} from "../../analytics/intercom/IntercomAnalytics";
import {useIntercomData} from "../../apps/repository/integrations/IntercomHooks";

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

declare var window: any;


export const AccountControl = memoForwardRefDiv(function AccountControl(props: IProps, ref) {

    const logoutAction = useLogoutAction();
    const popperController = usePopperController();

    function handleLogout() {
        popperController.dismiss();
        logoutAction();
    }

    /**
     * Return true if the provided email can accept users into the beta
     */
    function canAcceptBeta(email: EmailStr | undefined) {
        const canAccept: string[] = [
            'dzhuneyt@getpolarized.io',
            'jonathan@getpolarized.io',
            'jonathan.graeupner@gmail.com',
            'burton@getpolarized.io',
        ];
        return email && canAccept.includes(email);
    }

    const intercomClient = createIntercomClient();
    const intercomData = useIntercomData();

    return (

        <div style={{padding: '10px 20px'}} ref={ref}>

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

                <div className="mt-2 pb-2 border-top text-center">

                    <div className="mt-4 mb-4">
                        <PlanUsage variant='h6'/>
                    </div>

                    <div className="mt-2 mb-4">
                        <AccountOverview subscription={props.userInfo.subscription}/>
                    </div>

                    <ViewPlansAndPricingButton/>

                    <Button color="secondary"
                            variant="contained"
                            size="large"
                            onClick={() => {
                                if (intercomData && intercomClient) {
                                    intercomClient.update({
                                        ...intercomData,
                                        hide_default_launcher: false,
                                    });
                                    intercomClient.showMessages();
                                }
                            }}>

                        <i className="fas fa-certificate"/>
                        &nbsp;
                        Open Intercom

                    </Button>

                    {canAcceptBeta(props.userInfo.email) && <AcceptBatch/>}
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
