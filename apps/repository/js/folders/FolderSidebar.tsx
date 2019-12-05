import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {ContextMenuComponents, FolderContextMenus} from "./FolderContextMenus";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {DatastoreUserTags} from "../../../../web/js/datastore/DatastoreUserTags";
import {TagStr, TagType} from "polar-shared/src/tags/Tags";
import {Logger} from "polar-shared/src/logger/Logger";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {PersistenceLayerMutator} from "../persistence_layer/PersistenceLayerMutator";

const log = Logger.create();

export class FolderSidebar extends React.Component<IProps, IState> {

    private folderContextMenuComponents: ContextMenuComponents;

    private tagContextMenuComponents: ContextMenuComponents;

    constructor(props: IProps, context: any) {
        super(props, context);

        const {treeState, persistenceLayerMutator} = this.props;

        this.folderContextMenuComponents
            = FolderContextMenus.create({
                type: 'folder',
                treeState,
                persistenceLayerMutator,
            });

        this.tagContextMenuComponents
            = FolderContextMenus.create({
                type: 'tag',
                treeState,
                persistenceLayerMutator,
            });

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

    readonly persistenceLayerMutator: PersistenceLayerMutator;
    readonly treeState: TreeState<TagDescriptor>;
    readonly tags: ReadonlyArray<TagDescriptor>;

}

export interface IState {

}

