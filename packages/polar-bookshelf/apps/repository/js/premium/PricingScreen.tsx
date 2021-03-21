import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {PricingStoreProvider} from './PricingStore';
import {PricingContent} from "./PricingContent";
import {DefaultChangePlanContextProvider} from "./actions/DefaultChangePlanContextProvider";

export const PricingScreen = () => {

    return (
        <PricingStoreProvider>
            <DefaultChangePlanContextProvider>
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
            </DefaultChangePlanContextProvider>
        </PricingStoreProvider>

    );
};

