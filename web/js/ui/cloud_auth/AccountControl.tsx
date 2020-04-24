/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountOverview} from "../../../../apps/repository/js/account_overview/AccountOverview";
import {Analytics} from "../../analytics/Analytics";
import {UserAvatar} from "./UserAvatar";
import Button from "@material-ui/core/Button";
import {EmailStr, URLStr} from "polar-shared/src/util/Strings";
import {accounts} from "polar-accounts/src/accounts";
import {MUIRouterLink} from "../../../spectron0/material-ui/MUIRouterLink";
import Subscription = accounts.Subscription;

const LogoutButton = (props: IProps) => {

    return <Button id="cloud-sync-logout"
                   color="secondary"
                   onClick={() => props.onLogout()}>

        Logout

    </Button>;

};
//
// const InviteUsersButton = () => {
//
//     return <Link to={{pathname: '/invite'}}>
//         <Button id="cloud-sync-invite-users"
//                 color="secondary"
//                 outline
//                 size="md">
//
//             <i className="fas fa-user-plus mr-1"/>
//
//             Invite Users
//
//         </Button>
//     </Link>;
//
// };

const ViewPlansAndPricingButton = () => {

    const handler = () => {
        Analytics.event({category: 'premium', action: 'view-plans-and-pricing-button'});
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

export class AccountControl extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        const props = this.props;

        return (

            <div className="p-2">

                <div>
                    <div className="text-center">

                        <div style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center'
                             }}>
                            <UserAvatar size="large"
                                        displayName={props.userInfo.displayName}
                                        style={{width: '100px', height: '100px'}}
                                        photoURL={props.userInfo.photoURL}/>
                        </div>

                        <div className="p-1">

                            <div className="text-lg"
                                 style={{fontWeight: 'bold'}}>

                                {this.props.userInfo.displayName || 'Anonymous'}

                            </div>

                            <div className="text-muted text-md"
                                 style={{}}>
                                {this.props.userInfo.email || ''}
                            </div>


                        </div>


                    </div>

                    <div className="mt-2 pt-2 pb-2 border-top text-center">

                        <div className="mt-2 mb-3">
                            <AccountOverview plan={this.props.userInfo.subscription.plan}/>
                        </div>

                        <ViewPlansAndPricingButton/>

                    </div>

                    <div className="mt-2 pt-2 pb-2 border-top text-right">

                        <div style={{display: 'flex', whiteSpace: 'nowrap'}}
                             className="mt-2">


                            <div className="ml-auto mr-1">
                                {/*<InviteUsersButton/>*/}
                            </div>

                            <div>
                                <LogoutButton {...props}/>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

}

interface IBasicUserInfo {
    readonly photoURL?: URLStr;
    readonly displayName?: string | undefined;
    readonly email?: EmailStr;
    readonly subscription: Subscription;
}

interface IProps {

    readonly userInfo: IBasicUserInfo;

    readonly onLogout: () => void;

}

interface IState {
}
