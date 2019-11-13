/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountPlan, AccountPlans} from "../../accounts/Account";
import {AccountProvider} from "../../accounts/AccountProvider";
import {Button} from "reactstrap";
import {RendererAnalytics} from "../../ga/RendererAnalytics";

export class PremiumFeature extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onUpgrade = this.onUpgrade.bind(this);
    }

    public render() {

        const {required, feature} = this.props;

        const PremiumFeatureWarning = () => {
            const {size} = this.props;

            switch (size) {
                case "xs":
                    break;
                case "sm":
                    break;
                case "md":
                    break;
                case "lg":
                    break;
            }

        };

        const hasRequiredPlan = () => {

            const account = AccountProvider.get();

            if (! account) {
                // this is a local only account not using cloud and right now
                // we're not forcing them to upgrade.
                return true;
            }

            // return AccountPlans.hasLevel(required, account.plan);
            return AccountPlans.hasLevel(required, 'free');

        };

        if (hasRequiredPlan()) {
            return this.props.children;
        } else {
            return (

                <div>
                    <Button size='sm'
                            color="light"
                            className="border"
                            onClick={() => this.onUpgrade()}>

                        <i className="fas fa-gem"/> Upgrade to {required} to unlock {feature}

                    </Button>
                </div>

            );
        }

    }

    private onUpgrade() {
        RendererAnalytics.event({category: 'premium', action: 'upgrade-from-premium-feature-wall'});
        document.location.hash = "plans";
    }

}

export type UISize = 'xs' | 'sm' | 'md' | 'lg';

interface IProps {
    readonly required: AccountPlan;
    readonly feature: string;
    readonly size: UISize;
}

interface IState {
}

