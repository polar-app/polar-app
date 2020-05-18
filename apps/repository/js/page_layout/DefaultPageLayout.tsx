import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {PersistenceLayerController} from "../../../../web/js/datastore/PersistenceLayerManager";
import {FixedNav} from "../FixedNav";
import {RepoHeader} from "../repo_header/RepoHeader";
import {RepoFooter} from "../repo_footer/RepoFooter";
import * as React from "react";

interface IProps {

    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;

    readonly children: any;

}

export const DefaultPageLayout = (props: IProps) => (

    <FixedNav id="doc-repository"
              className="default-page-layout">

        <FixedNav.Body className="p-1"
                       style={{
                           overflow: 'auto'
                       }}>

            <div className="ml-auto mr-auto mt-3"
                 style={{maxWidth: '700px'}}>

                {props.children}

            </div>


        </FixedNav.Body>

        <FixedNav.Footer>
            <RepoFooter/>
        </FixedNav.Footer>

    </FixedNav>

)
