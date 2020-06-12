/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountProvider} from "../../accounts/AccountProvider";
import {Link} from "react-router-dom";
import {AccountPlans} from "../../accounts/Account";
import {accounts} from 'polar-accounts/src/accounts';
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";

export class PremiumFeature extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onUpgrade = this.onUpgrade.bind(this);
    }

    public render() {

        const {required, feature} = this.props;

        const PremiumFeatureWarningSM = () => {
            return <div>
                <UpgradeButton/>
            </div>;

        };

        const PremiumFeatureWarningMD = () => {
            return <div>

                <div style={{filter: 'blur(8px)'}}>
                    {this.props.children}
                </div>

                <div className="text-center mt-1">
                    <UpgradeButton/>
                </div>

            </div>;

        };
        const PremiumFeatureWarning = () => {
            const {size} = this.props;

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

            const account = AccountProvider.get();

            if (! account) {
                // this is a local only account not using cloud and right now
                // we're not forcing them to upgrade.
                return true;
            }

            return AccountPlans.hasLevel(required, account.plan);
            // return AccountPlans.hasLevel(required, 'free');

        };

        const UpgradeButton = () => {

            const account = AccountProvider.get();

            const color = AccountPlans.toColor(account!.plan);

            return (
                <Link to={{pathname: '/plans'}}>
                    <Button variant="contained"
                            className="border"
                            onClick={() => this.onUpgrade()}>

                        <i className="fas fa-gem" style={{color}}/> Upgrade to {required} to unlock {feature}

                    </Button>
                </Link>
            );

        };

        if (hasRequiredPlan()) {
            return this.props.children;
        } else {
            return (
                <PremiumFeatureWarning/>
            );
        }

    }

    private onUpgrade() {
        Analytics.event({category: 'premium', action: 'upgrade-from-premium-feature-wall'});
        document.location.hash = "plans";
    }

}

export type UISize = 'xs' | 'sm' | 'md' | 'lg';

interface IProps {
    readonly required: accounts.Plan;
    readonly feature: string;
    readonly size: UISize;
}

interface IState {
}

