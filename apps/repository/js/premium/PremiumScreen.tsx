import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {PremiumContent} from './PremiumContent';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {PremiumStoreProvider} from './PremiumStore';

export const PremiumScreen = () => {

    return (
        <PremiumStoreProvider>
            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PremiumContent/>
                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>
        </PremiumStoreProvider>

    );
};
