import * as React from 'react';
import {SupportContent} from './SupportContent';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {PersistenceLayerController} from "../../../../web/js/datastore/PersistenceLayerManager";
import { accounts } from 'polar-accounts/src/accounts';

export class SupportScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <SupportContent plan={this.props.plan}/>
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
    readonly plan: accounts.Plan;

}

export interface IState {

}
