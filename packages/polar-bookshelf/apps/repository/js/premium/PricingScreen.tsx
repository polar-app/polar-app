import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {PricingStoreProvider} from './PricingStore';
import {PricingContent} from "./PricingContent";
import {DefaultChangePlanContextProvider} from "./actions/DefaultChangePlanContextProvider";
import {HeaderBar} from '../doc_repo/HeaderBar';

export const PricingScreen = () => {

    return (
        <PricingStoreProvider>
            <DefaultChangePlanContextProvider>
                <HeaderBar title={'Pricing'}/>
                <FixedNav id="doc-repository">

                    <FixedNavBody className="container-fluid">

                        <div className="row">

                            <div className="col-lg-12 w-100 pt-4">
                                <PricingContent/>
                            </div>
                        </div>

                    </FixedNavBody>

                </FixedNav>
            </DefaultChangePlanContextProvider>
        </PricingStoreProvider>

    );
};

