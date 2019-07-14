import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {CreateGroupForm} from "./CreateGroupForm";
import {RepoDocMetaManager} from "../RepoDocMetaManager";

export class CreateGroupScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        // FIXME: filter out folders. Just basic tags only.
        // FIXME: filter out folders on the backend too.
        const tagsProvider = () => this.props.repoDocMetaManager!.repoDocInfoIndex.toTagDescriptors();
        const relatedTags = this.props.repoDocMetaManager!.relatedTags;

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerManager={this.props.persistenceLayerManager}/>

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-2">

                            <CreateGroupForm relatedTags={relatedTags}
                                             tagsProvider={tagsProvider}/>


                        </div>
                    </div>

                </FixedNavBody>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoDocMetaManager: RepoDocMetaManager;
}

export interface IState {

}
