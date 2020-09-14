import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {PremiumContent2} from './PremiumContent2';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {PremiumStoreProvider} from './PremiumStore';

export const PremiumScreen = () => {

    return (
        <PremiumStoreProvider>
            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PremiumContent2/>
                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>
        </PremiumStoreProvider>

    );
};
