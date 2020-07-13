import * as React from 'react';
import {FixedNav, FixedNavBody} from '../../../FixedNav';
import {PremiumContent2} from './PremiumContent2';
import {RepoFooter} from "../../../repo_footer/RepoFooter";
import {accounts} from "polar-accounts/src/accounts";
import {useUserInfoContext} from "../../../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {RepositoryLayout} from "../../../../../../web/js/apps/repository/RepositoryLayout";

export interface IProps {
    readonly interval?: accounts.Interval;
}

export const PremiumScreen = (props: IProps) => {

    const userInfoContext = useUserInfoContext();

    const plan = userInfoContext?.userInfo?.subscription.plan || 'free'

    return (

        <RepositoryLayout>
            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PremiumContent2 interval={props.interval} plan={plan}/>
                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>
        </RepositoryLayout>

    );
};
