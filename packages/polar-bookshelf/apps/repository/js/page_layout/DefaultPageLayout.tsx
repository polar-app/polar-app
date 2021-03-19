import {FixedNav} from "../FixedNav";
import * as React from "react";

interface IProps {
    readonly children: React.ReactElement;
}

export const DefaultPageLayout = (props: IProps) => (

    <FixedNav id="doc-repository"
              className="default-page-layout">

        <FixedNav.Body className="p-1"
                       style={{
                           overflow: 'auto'
                       }}>

            <div className="ml-auto mr-auto"
                 style={{maxWidth: '700px'}}>

                {props.children}

            </div>


        </FixedNav.Body>

    </FixedNav>

)
