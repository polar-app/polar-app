import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {SyncBarProgress} from '../../../../web/js/ui/sync_bar/SyncBar';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoHeader} from '../repo_header/RepoHeader';
import {MessageBanner} from '../MessageBanner';
import {FixedNav} from '../FixedNav';
import PreviewAndMainViewDock from './PreviewAndMainViewDock';
import {Dock} from '../../../../web/js/ui/dock/Dock';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {AnnotationRepoFilterEngine, UpdatedCallback} from './AnnotationRepoFilterEngine';
import {PersistenceLayerManagers} from '../../../../web/js/datastore/PersistenceLayerManagers';
import {RepoDocMetaLoaders} from '../RepoDocMetaLoaders';
import {AnnotationRepoFiltersHandler} from './AnnotationRepoFiltersHandler';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {Tag, Tags, TagStr} from 'polar-shared/src/tags/Tags';
import {FilteredTags} from '../FilteredTags';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {Row} from "../../../../web/js/ui/layout/Row";
import {Reviewers} from "../reviewer/Reviewers";
import {TextFilter} from "./filter_bar/TextFilter";
import {HighlightColorFilterButton} from "./filter_bar/controls/color/HighlightColorFilterButton";
import {AnnotationTypeSelector} from "./filter_bar/controls/annotation_type/AnnotationTypeSelector";
import {StartReviewDropdown} from "./filter_bar/StartReviewDropdown";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {RepoFooter} from "../repo_footer/RepoFooter";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationRepoTableDropdown} from "./AnnotationRepoTableDropdown";
import {ContextMenuComponents, FolderContextMenus} from "../FolderContextMenus";

export class AnnotationRepoSidebar extends ReleasingReactComponent<IProps, IState> {

    private folderContextMenuComponents: ContextMenuComponents;

    private tagContextMenuComponents: ContextMenuComponents;

    constructor(props: IProps, context: any) {
        super(props, context);


        const {treeState} = this.props;

        this.folderContextMenuComponents
            = FolderContextMenus.create('folder',
                                        treeState,
                                        (tags) => console.log("FIXME: folder onCreate: ", tags));

        this.tagContextMenuComponents
            = FolderContextMenus.create('tag',
                                        treeState,
                                        (tags) => console.log("FIXME: tag onCreate: ", tags));

    }

    public render() {

        const {treeState, tags} = this.props;

        return (

            <div style={{
                     display: 'flex' ,
                     flexDirection: 'column',
                     height: '100%',
                    overflow: 'auto',
                 }}>

                <div className="m-1">

                    {this.folderContextMenuComponents.contextMenu()}

                    {this.tagContextMenuComponents.contextMenu()}

                    <TagTree tags={tags}
                             treeState={treeState}
                             rootTitle="Folders"
                             tagType='folder'
                             nodeContextMenuRender={this.folderContextMenuComponents.render}
                             noCreate={true}/>

                    <TagTree tags={tags}
                             treeState={treeState}
                             rootTitle="Tags"
                             tagType='regular'
                             filterDisabled={true}
                             nodeContextMenuRender={this.tagContextMenuComponents.render}
                             noCreate={true}/>

                </div>

            </div>
        );
    }

}

export interface IProps {

    readonly treeState: TreeState<TagDescriptor>;
    readonly tags: ReadonlyArray<TagDescriptor>;

}

export interface IState {

}

