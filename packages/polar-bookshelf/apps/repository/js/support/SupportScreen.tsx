import * as React from 'react';
import {SupportContent} from './SupportContent';
import {FixedNav, FixedNavBody} from '../FixedNav';

export interface IProps {
}

export function SupportScreen() {

    return (

        <FixedNav id="doc-repository">

            <FixedNavBody className="container-fluid">

                <div className="row">

                    <div className="col-lg-12 w-100 pt-4">
                        <SupportContent/>
                    </div>
                </div>

            </FixedNavBody>

        </FixedNav>

    );
}
