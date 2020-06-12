import * as React from 'react';
import {FixedNav, FixedNavBody} from '../../../FixedNav';
import {PremiumContent2} from './PremiumContent2';
import {RepoFooter} from "../../../repo_footer/RepoFooter";
import {accounts} from "polar-accounts/src/accounts";

export interface IProps {
    readonly plan: accounts.Plan;
    readonly interval?: accounts.Interval;
}

export class PremiumScreen extends React.Component<IProps> {

    public render() {

        return (

            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PremiumContent2 interval={this.props.interval}
                                             plan={this.props.plan}/>
                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>

        );
    }

}
