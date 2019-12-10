/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountPlan} from '../../../../../../web/js/accounts/Account';
import {NullCollapse} from '../../../../../../web/js/ui/null_collapse/NullCollapse';
import Button from 'reactstrap/lib/Button';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';
import {Dialogs} from '../../../../../../web/js/ui/dialogs/Dialogs';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Toaster} from '../../../../../../web/js/ui/toaster/Toaster';
import {Numbers} from "polar-shared/src/util/Numbers";
import {DesktopContent, MobileContent} from "./PremiumCopy";
import {Devices} from "../../../../../../web/js/util/Devices";

const log = Logger.create();

function cancelSubscription() {

    const onConfirm = () => {
        Toaster.info("Canceling plan.  One moment...");

        AccountActions.cancelSubscription()
            .catch(err => log.error("Unable to cancel plan: ", err));
    };

    Dialogs.confirm({
        title: `Are you sure you want to cancel your plan and revert to the free tier?`,
        subtitle: 'Your billing will automatically be updated and account pro-rated.',
        onConfirm
    });

}

export const CancelSubscriptionButton = (props: IProps) => {

    return <NullCollapse open={props.plan !== 'free'}>

        <Button color="secondary"
                size="sm"
                onClick={() => cancelSubscription()}>

            Cancel Subscription

        </Button>

    </NullCollapse>;
};

interface PlanIntervalProps {
    readonly planInterval: PlanInterval;
    readonly togglePlanInterval: () => void;
}

export const PlanIntervalButton = (props: PlanIntervalProps) => {

    return <Button color="secondary"
                   size="md"
                   onClick={() => props.togglePlanInterval()}>

            Show {props.planInterval === 'month' ? 'Yearly' : 'Monthly'} Plans

        </Button>;

};


interface PlanPricingProps {
    readonly plan: AccountPlan;
    readonly planInterval: PlanInterval;
}
const PlanPricing = (props: PlanPricingProps) => {

    const computeMonthlyAmount = () => {

        switch (props.plan) {

            case "free":
                return 0.0;
            case "bronze":
                return 4.99;
            case "silver":
                return 9.99;
            case "gold":
                return 14.99;
        }

    };


    const computeYearlyAmount = () => {
        const monthlyAmount = computeMonthlyAmount();
        return Numbers.toFixedFloat(monthlyAmount * 11, 2);
    };

    const amount = props.planInterval === 'month' ? computeMonthlyAmount() : computeYearlyAmount();

    return <div>
        <h3 className="text-xxlarge">${amount}<span
            className="text-small">/{props.planInterval}</span>
        </h3>

    </div>;

};


export const PricingOverview = () => {
    return (
        <div>
            <div className="text-center mb-3">
                <h1>Pricing and Plans</h1>
            </div>

            <p className="text-center mb-3 text-xlarge">
                Polar is designed to scale to from both novice users to
                Power users.

                Just need to read a few PDFs. No problem. Need to manage
                and read hundreds to thousands of documents? No problem.
            </p>

            <p className="text-center mb-3 text-xlarge">
                Have an issue?  Feel free to send us an email at <b>support@getpolarized.io</b>
            </p>
        </div>
    );
};

export const FindPlan = () => {

    return <div>
        <h2 className="text-tint text-left">

            Find a plan<br/>

            {/*<span className="text-large">that's right for you.</span>*/}

        </h2>


        <p>
            We have both yearly and monthly plans.  Get a free
            month of service if you buy for a whole year!
        </p>


    </div>;

};

export const FreePlan = () => {
    return <div>
        <h2>Free</h2>

        <h3 className="text-xxlarge">$0</h3>
        <p className="text-small text-tint">
            We want as many people to use Polar as
            possible. Most people
            easily stay within these limits.
        </p>

    </div>;
};

export const BronzePlan = (props: IState) => {
    return <div>
        <h2>Bronze</h2>

        <PlanPricing plan='bronze' planInterval={props.planInterval}/>

        <p className="text-small text-tint">Less
            than the price of a cup of
            coffee. Need more storage and ready to
            move up to the next level? We're ready
            when you are!</p>

    </div>;
};

export const SilverPlan = (props: IState) => {
    return <div>
        <h2>Silver</h2>

        <PlanPricing plan='silver' planInterval={props.planInterval}/>

        <p className="text-small text-tint">
            Designed for Polar power users! Need
            more storage? Let's do this!
        </p>
    </div>;
};

export const GoldPlan = (props: IState) => {
    return <div>
        <h2>Gold</h2>

        <PlanPricing plan='gold' planInterval={props.planInterval}/>

        <p className="text-small text-tint">
            You can't live without Polar
            and have a massive amount of data that
            you need to keep secure.
        </p>
        <br/>
    </div>;
};


export class PremiumContent2 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.togglePlanInterval = this.togglePlanInterval.bind(this);

        this.state = {
            planInterval: 'month'
        };

    }

    public render() {

        if (Devices.isPhone()) {

            return (
                <MobileContent {...this.props}
                               {...this.state}
                               togglePlanInterval={() => this.togglePlanInterval()}/>
            );

        } else {
            return (
                <DesktopContent {...this.props}
                                {...this.state}
                                togglePlanInterval={() => this.togglePlanInterval()}/>
            );

        }

    }

    private togglePlanInterval() {

        this.setState({
            planInterval: this.state.planInterval === 'month' ? 'year' : 'month'
        });

    }

}

interface IProps {
    readonly plan: AccountPlan;
    readonly userInfo?: UserInfo;
}

interface IState {
    readonly planInterval: PlanInterval;
}

export type PlanInterval = 'month' | 'year';
