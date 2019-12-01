import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TagDescriptor} from '../../../../web/js/tags/TagNode';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {ContextMenuComponents, FolderContextMenus} from "./FolderContextMenus";

export class FolderSidebar extends React.Component<IProps, IState> {

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

