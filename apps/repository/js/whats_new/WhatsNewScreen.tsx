import * as React from 'react';
import {WhatsNewContent} from '../splash2/whats_new/WhatsNewContent';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepositoryLayout} from "../../../../web/js/apps/repository/RepositoryLayout";

export default function WhatsNewScreen() {

    return (

        <RepositoryLayout>
            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-2">
                            <WhatsNewContent/>
                        </div>
                    </div>

                </FixedNavBody>

            </FixedNav>
        </RepositoryLayout>

    );
}
