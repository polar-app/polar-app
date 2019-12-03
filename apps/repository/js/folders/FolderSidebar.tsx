import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {ContextMenuComponents, FolderContextMenus} from "./FolderContextMenus";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {DatastoreUserTags} from "../../../../web/js/datastore/DatastoreUserTags";
import {TagStr} from "polar-shared/src/tags/Tags";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class FolderSidebar extends React.Component<IProps, IState> {

    private folderContextMenuComponents: ContextMenuComponents;

    private tagContextMenuComponents: ContextMenuComponents;

    constructor(props: IProps, context: any) {
        super(props, context);

        const {treeState, persistenceLayerProvider} = this.props;

        const onCreate = (newTag: TagStr) => {

            const persistenceLayer = persistenceLayerProvider();
            const prefs = persistenceLayer.datastore.getPrefs();

            const doHandle = async () => {
                await DatastoreUserTags.create(prefs, newTag);
            };

            doHandle()
                .catch(err => log.error("Unable to create tag: " + newTag, err));

        };

        this.folderContextMenuComponents
            = FolderContextMenus.create('folder',
                                        treeState,
                                        (newTag) => onCreate(newTag));

        this.tagContextMenuComponents
            = FolderContextMenus.create('tag',
                                        treeState,
                                        (newTag) => onCreate(newTag));

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

    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly treeState: TreeState<TagDescriptor>;
    readonly tags: ReadonlyArray<TagDescriptor>;

}

export interface IState {

}

