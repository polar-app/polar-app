import * as React from 'react';
import {WhatsNewContent} from '../splash2/whats_new/WhatsNewContent';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

export default class WhatsNewScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-2">
                            <WhatsNewContent/>
                        </div>
                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

export interface IState {

}
