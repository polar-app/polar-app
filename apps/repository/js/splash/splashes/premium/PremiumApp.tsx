import * as React from 'react';
import {FixedNav} from '../../../FixedNav';
import {FixedNavBody} from '../../../FixedNav';
import {RepoHeader} from '../../../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../../../web/js/datastore/PersistenceLayerManager';
import {PremiumContent} from './PremiumContent';

export class PremiumApp extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">
                            <PremiumContent/>
                        </div>
                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

export interface IState {

}
