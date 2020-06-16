/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Link} from "react-router-dom";
import {AccountPlans} from "../../accounts/Account";
import {accounts} from 'polar-accounts/src/accounts';
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";

export type UISize = 'xs' | 'sm' | 'md' | 'lg';

interface IProps {
    readonly required: accounts.Plan;
    readonly feature: string;
    readonly size: UISize;
    readonly children: React.ReactElement;
}

export const PremiumFeature = (props: IProps) => {

    const {required, feature} = props;
    const userInfoContext = useUserInfoContext();

    function onUpgrade() {
        Analytics.event({category: 'premium', action: 'upgrade-from-premium-feature-wall'});
        document.location.hash = "plans";
    }

    const PremiumFeatureWarningSM = () => {
        return <div>
            <UpgradeButton/>
        </div>;

    };

    const PremiumFeatureWarningMD = () => {
        return <div>

            <div style={{filter: 'blur(8px)'}}>
                {props.children}
            </div>

            <div className="text-center mt-1">
                <UpgradeButton/>
            </div>

        </div>;

    };
    const PremiumFeatureWarning = () => {
        const {size} = props;

        switch (size) {
            case "xs":
                return <PremiumFeatureWarningSM/>;
            case "sm":
                return <PremiumFeatureWarningSM/>;
            case "md":
                return <PremiumFeatureWarningMD/>;
            case "lg":
                return <PremiumFeatureWarningMD/>;
        }

    };

    const hasRequiredPlan = () => {

        if (! userInfoContext) {
            return false;
        }

        if (! userInfoContext.userInfo) {
            return false;
        }

        return AccountPlans.hasLevel(required, userInfoContext?.userInfo?.subscription.plan);

    };

    const UpgradeButton = () => {

        const color = AccountPlans.toColor(userInfoContext?.userInfo?.subscription?.plan || 'free');

        return (
            <Link to={{pathname: '/plans'}}>
                <Button variant="contained"
                        className="border"
                        onClick={() => onUpgrade()}>

                    <i className="fas fa-gem" style={{color}}/> Upgrade to {required} to unlock {feature}

                </Button>
            </Link>
        );

    };

    if (hasRequiredPlan()) {
        return props.children;
    } else {
        return (
            <PremiumFeatureWarning/>
        );
    }

}


