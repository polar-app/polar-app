import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {PremiumStoreProvider} from './PremiumStore';
import {PricingContent} from "./PremiumContent2";

export const PricingScreen = () => {

    return (
        <PremiumStoreProvider>
            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PricingContent/>
                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>
        </PremiumStoreProvider>

    );
};

