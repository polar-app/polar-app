import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoHeader} from '../repo_header/RepoHeader';
import {FixedNav} from '../FixedNav';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {UIComponents} from "../../../../web/spectron0/ui-components/UIComponents";

export class UIComponentsScreen extends ReleasingReactComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);


    }

    public render() {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <header>
                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerManager}/>

                </header>

                <UIComponents/>

            </FixedNav>

        );
    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly persistenceLayerProvider: PersistenceLayerProvider;

}

export interface IState {

}

