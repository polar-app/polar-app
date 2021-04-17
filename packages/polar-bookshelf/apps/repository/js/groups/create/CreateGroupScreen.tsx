import * as React from 'react';
import {FixedNav, FixedNavBody} from '../../FixedNav';
import {PersistenceLayerController} from '../../../../../web/js/datastore/PersistenceLayerManager';
import {CreateGroupForm} from "./CreateGroupForm";
import {RepoDocMetaManager} from "../../RepoDocMetaManager";
import {Tags} from "polar-shared/src/tags/Tags";
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
        const relatedTags = this.props.repoDocMetaManager!.relatedTagsManager;

        return (

            <FixedNav id="doc-repository">

                <header>

                    {/*<RepoHeader/>*/}

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
