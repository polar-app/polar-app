/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {SplitLayout, SplitLayoutLeft} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayoutRight';
import {CallToActionLink} from '../components/CallToActionLink';
import {PremiumButton} from './PremiumButton';

export class PremiumContent2 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        /* WARN: taken directly from polar-site */

        return (
            <div>

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
                                <th className="highlight-plan">
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
                                <td className="highlight-plan">
                                    <PremiumButton from="free" to="bronze"/>
                                </td>
                                <td>
                                    <PremiumButton from="free" to="silver"/>
                                </td>
                                <td className="">
                                    <PremiumButton from="free" to="gold"/>
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Automatic Updates
                                </td>

                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="highlight-plan">
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
                                <td className="highlight-plan">
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
                                <td className="highlight-plan">
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
                                <td className="highlight-plan">
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
                                <td className="highlight-plan">
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
                                <td className="highlight-plan">
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

                    <p className="text-center text-xlarge text-justify pt-5">
                        Polar is <b>always Open Source!</b> We're "free as in
                        liberty."
                        Developers who contribute back to Polar get a year of
                        cloud storage for
                        free. If you'd like you can compile Polar from source
                        directly but
                        cloud usage fees still apply. Note that you can always
                        use Polar without
                        the cloud and just use the desktop app directly. This
                        way Polar will be
                        "free as in beer." Just make sure to <b>backup your
                        data!</b>.
                    </p>

                </div>


            </div>
        );
    }

}

interface IProps {
}

interface IState {
}

