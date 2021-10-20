import {FixedNav} from "../FixedNav";
import * as React from "react";

export const DefaultPageLayout: React.FC = ({ children }) => (

    <FixedNav id="doc-repository"
              className="default-page-layout">

        <FixedNav.Body>

            <div className="ml-auto mr-auto"
                 style={{maxWidth: '700px'}}>

                {children}

            </div>

        </FixedNav.Body>

    </FixedNav>

)
