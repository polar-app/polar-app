/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountPlan, AccountPlans} from "../../accounts/Account";
import {AccountProvider} from "../../accounts/AccountProvider";

export class PremiumFeature extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        const requiredPlan = this.props.required;

        const hasRequiredPlan = () => {

            const account = AccountProvider.get();

            if (! account) {
                // this is a local only account not using cloud and right now
                // we're not forcing them to upgrade.
                return true;
            }

            return AccountPlans.hasLevel(requiredPlan, account.plan);

        };

        if (hasRequiredPlan()) {
            return this.props.children;
        } else {
            return (

                <div>
                    Premium feature bro...
                </div>

            );
        }


    }

}

export type UISize = 'xs' | 'sm' | 'md' | 'lg';

interface IProps {
    readonly required: AccountPlan;
    readonly size: UISize;
}

interface IState {
}

