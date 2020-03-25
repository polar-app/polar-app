/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../apps/repository/auth_handler/AuthHandler';
import Button from 'reactstrap/lib/Button';
import {Link} from "react-router-dom";
import {AccountOverview} from "../../../../apps/repository/js/account_overview/AccountOverview";
import {Analytics} from "../../analytics/Analytics";

const LogoutButton = (props: IProps) => {

    return <Button id="cloud-sync-logout"
                   color="danger"
                   outline
                   size="md"
                   onClick={() => props.onLogout()}
                   className="ml-1">

        <i className="fas fa-sign-out-alt mr-1"/>

        Logout

    </Button>;

};

const UserImage = (props: IProps) => {

    if (props.userInfo.photoURL) {

        return (
            <div className="ml-auto mr-auto"
                 style={{
                     height: '125px',
                     width: '125px'
                 }}>
                <img className="rounded border m-auto"
                     style={{
                         maxHeight: '125px',
                         maxWidth: '125px'
                     }}
                     src={props.userInfo.photoURL}/>
            </div>
        );
    } else {
        return <div/>;
    }

};

const InviteUsersButton = () => {

    return <Link to={{pathname: '/invite'}}>
        <Button id="cloud-sync-invite-users"
                color="secondary"
                outline
                size="md">

            <i className="fas fa-user-plus mr-1"/>

            Invite Users

        </Button>
    </Link>;

};

const ViewPlansAndPricingButton = () => {

    const handler = () => {
        Analytics.event({category: 'premium', action: 'view-plans-and-pricing-button'});
    };

    return (
        <Link to='/plans'>
            <Button color="success"
                    size="lg"
                    onClick={handler}>

                <i className="fas fa-certificate"/>
                &nbsp;
                View Plans and Pricing

            </Button>
        </Link>
    );
};

export class AccountControl extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        const props = this.props;

        return (

            <div>

                <div>
                    <div className="text-center"
                        style={{
                    }}>

                        <UserImage {...props}/>

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

                        <div style={{display: 'flex', whiteSpace: 'nowrap'}} className="mt-2">


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

interface IProps {

    readonly userInfo: UserInfo;

    readonly onLogout: () => void;

}

interface IState {
}
