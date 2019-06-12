import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../../../../../../web/js/ui/util/Nav';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';
import {Logger} from '../../../../../../web/js/logger/Logger';
import {NullCollapse} from '../../../../../../web/js/ui/null_collapse/NullCollapse';
import {Dialogs} from '../../../../../../web/js/ui/dialogs/Dialogs';
import {Toaster} from '../../../../../../web/js/ui/toaster/Toaster';

const log = Logger.create();

export class PremiumButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const {to, from, userInfo} = this.props;

        // true when this is the current plan and we do not need to show the
        // button
        const currentPlan = to === from;

        const email = userInfo ? userInfo.email : undefined;

        // true if we're BUYING a new plan...
        const buy = from === 'free';

        const text = buy ? "Buy" : "Change";

        const buyHandler = () => {
            // if we're buying a NEW product go ahead and redirect us to
            // stripe and use their BUY package.  This is better than embedding
            // the stripe SDK and also stripe ALSO needs to run over HTTPS

            if (email) {
                Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?email=${email}&plan=${to}`);
            } else {
                Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?plan=${to}`);
            }

        };

        const changeHandler = () => {

            const onConfirm = () => {

                console.log("Changing plan to: " + to);

                Toaster.info(`Changing plan to ${to}.  One moment...`);

                AccountActions.changePlan(to)
                    .catch(err => log.error("Unable to upgrade plan: ", err));
            };

            Dialogs.confirm({
                title: `Are you sure you want to ${to}?`,
                subtitle: 'Your billing will automatically be updated and account pro-rated.',
                onConfirm
            });

        };

        const handler = buy ? buyHandler : changeHandler;

        return (

            <NullCollapse open={! currentPlan}>

                <Button color="secondary"
                        onClick={() => handler()}>

                    {text}

                </Button>

            </NullCollapse>

        );
    }

}

export interface IProps {
    readonly from: Plan;
    readonly to: Plan;
    readonly userInfo?: UserInfo;

}

export interface IState {

}

export type Plan = 'free' | 'bronze' | 'silver' | 'gold';
