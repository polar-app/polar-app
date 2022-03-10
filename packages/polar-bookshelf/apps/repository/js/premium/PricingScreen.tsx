import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {PricingContent} from "./PricingContent";
import {DefaultChangePlanContextProvider} from "./actions/DefaultChangePlanContextProvider";
import {AdaptivePageLayout} from "../../../../apps/repository/js/page_layout/AdaptivePageLayout";

export const PricingScreen = () => {

    return (
        <DefaultChangePlanContextProvider>
            <AdaptivePageLayout fullWidth title="Pricing">
                <FixedNav id="doc-repository">

                    <FixedNavBody className="container-fluid">

                        <div className="row">

                            <div className="col-lg-12 w-100 pt-4">
                                <PricingContent/>
                            </div>
                        </div>

                    </FixedNavBody>

                </FixedNav>
            </AdaptivePageLayout>
        </DefaultChangePlanContextProvider>
    );
};

