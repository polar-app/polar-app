/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {PremiumButton} from './PremiumButton';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountPlan} from '../../../../../../web/js/accounts/Accounts';
import {NullCollapse} from '../../../../../../web/js/ui/null_collapse/NullCollapse';
import Button from 'reactstrap/lib/Button';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';

const CancelSubscriptionButton = (props: IProps) => {

    return <NullCollapse open={props.plan !== 'free'}>

        <Button color="secondary"
                size="sm"
                onClick={() => AccountActions.cancelSubscription()}>

            {/*FIXME: must prompt to change not just do it... */}

            Cancel Subscription

        </Button>

    </NullCollapse>;
};

export class PremiumContent2 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        /* WARN: taken directly from polar-site */

        return (
            <div className={"plan-" + this.props.plan}>

                <div id="pricing" className="hidden-xs">

                    <div className="text-center mb-3">
                        <h1>Pricing and Plans</h1>
                    </div>

                    <p className="text-center mb-3 text-xlarge">
                        Polar is designed to scale to from both novice users to
                        Power users.

                        Just need to read a few PDFs. No problem. Need to manage
                        and read hundreds to thousands of documents? No problem.
                    </p>

                    <div className="white-box high-shadow table-box">
                        <table className="table">
                            <thead>
                            <tr>
                                <th><h2 className="text-tint text-left">
                                    Find a plan<br/><span
                                    className="text-large">that's right for you.</span>
                                </h2></th>
                                <th className="">
                                    <p className="text-xlarge ">Free</p>

                                    <h3 className="text-xxlarge">$0</h3>
                                    <p className="text-small text-tint">
                                        We want as many people to use Polar as
                                        possible. Most people
                                        easily stay within these limits.
                                    </p>
                                    <br/>
                                </th>
                                <th className="">
                                    <p className="text-xlarge  highlight">Bronze</p>

                                    <h3 className="text-xxlarge">$4.99<span
                                        className="text-small">/month</span>
                                    </h3>
                                    <p className="text-small text-tint">Less
                                        than the price of a cup of
                                        coffee. Need more storage and ready to
                                        move up to the next level? We're ready
                                        when you are!</p>
                                    <br/>
                                </th>
                                <th className="">
                                    <p className="text-xlarge ">Silver</p>

                                    <h3 className="text-xxlarge">$9.99<span
                                        className="text-small">/month</span>
                                    </h3>
                                    <p className="text-small text-tint">
                                        Designed for Polar power users! Need
                                        more storage? Let's do this!
                                    </p>
                                    <br/>
                                </th>
                                <th className="">
                                    <p className="text-xlarge ">Gold</p>

                                    <h3 className="text-xxlarge">$14.99<span
                                        className="text-small">/month</span>
                                    </h3>
                                    <p className="text-small text-tint">
                                        You can't live without Polar
                                        and have a massive amount of data that
                                        you need to keep secure.
                                    </p>
                                    <br/>
                                </th>
                            </tr>
                            </thead>
                            <tbody>

                            <tr className="buy-links">
                                <td>
                                </td>
                                <td>
                                </td>
                                <td className="">
                                    <PremiumButton from={this.props.plan} to="bronze" userInfo={this.props.userInfo}/>
                                </td>
                                <td>
                                    <PremiumButton from={this.props.plan} to="silver" userInfo={this.props.userInfo}/>
                                </td>
                                <td className="">
                                    <PremiumButton from={this.props.plan} to="gold" userInfo={this.props.userInfo}/>
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Automatic Updates
                                </td>

                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Web + Desktop
                                </td>

                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Number of active cloud devices
                                </td>

                                <td className="">
                                    2
                                </td>
                                <td className="">
                                    unlimited
                                </td>
                                <td className="">
                                    unlimited
                                </td>
                                <td className="">
                                    unlimited
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Cloud storage
                                </td>

                                <td className="">
                                    Up to 350MB
                                </td>
                                <td className="">
                                    Up to 2GB
                                </td>
                                <td className="">
                                    Up to 5GB
                                </td>
                                <td className="">
                                    Up to 12GB
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Max Captured Web Documents
                                </td>

                                <td className="">
                                    Up to 100
                                </td>
                                <td className="">
                                    Up to 500
                                </td>
                                <td className="">
                                    Up to 1500
                                </td>
                                <td className="">
                                    unlimited
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Support
                                </td>

                                <td className="">
                                    <span className="feature-na">---</span>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                            </tr>

                            </tbody>
                        </table>

                    </div>

                    <div>

                        <div className="ml-auto">
                            <CancelSubscriptionButton {...this.props}/>
                        </div>

                    </div>

                </div>


            </div>
        );
    }

}

interface IProps {
    readonly plan: AccountPlan;
    readonly userInfo?: UserInfo;
}

interface IState {
}

