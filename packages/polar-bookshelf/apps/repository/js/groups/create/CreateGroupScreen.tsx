import * as React from 'react';
import {FixedNav, FixedNavBody} from '../../FixedNav';
import {RepoHeader} from '../../repo_header/RepoHeader';
import {
    PersistenceLayerController,
    PersistenceLayerManager
} from '../../../../../web/js/datastore/PersistenceLayerManager';
import {CreateGroupForm} from "./CreateGroupForm";
import {RepoDocMetaManager} from "../../RepoDocMetaManager";
import {Tags} from "polar-shared/src/tags/Tags";
import {AuthHandlers} from "../../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";

export class CreateGroupScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.createTagsProvider = this.createTagsProvider.bind(this);

        this.state = {
        };

    }

    public render() {

        const tagsProvider = this.createTagsProvider();
        const relatedTags = this.props.repoDocMetaManager!.relatedTags;

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

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

    private createTagsProvider() {

        return () => {

            const tags = this.props.repoDocMetaManager!.repoDocInfoIndex.toTagDescriptors();
            return Tags.onlyRegular(tags);

        };

    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
    readonly repoDocMetaManager: RepoDocMetaManager;
}

export interface IState {

}
