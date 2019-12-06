import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {ContextMenuComponents, FolderContextMenus} from "./FolderContextMenus";
import {Logger} from "polar-shared/src/logger/Logger";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {PersistenceLayerMutator} from "../persistence_layer/PersistenceLayerMutator";
import {InputFilter} from "../../../../web/js/ui/input_filter/InputFilter";

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
                     height: '100%'
                }}>

                <div className=""
                     style={{
                         height: '100%',
                         display: 'flex' ,
                         flexDirection: 'column',
                     }}>

                    {this.folderContextMenuComponents.contextMenu()}

                    {this.tagContextMenuComponents.contextMenu()}

                    <div className="m-1">
                        <InputFilter placeholder="Filter by tag or folder"/>
                        {/*<TagCreateSelect tags={tags} onChange={NULL_FUNCTION}/>*/}
                    </div>

                    <div style={{
                            flexGrow: 1,
                            overflow: 'auto',
                        }}>

                        <TagTree tags={tags}
                                 treeState={treeState}
                                 rootTitle="Folders"
                                 tagType='folder'
                                 filterDisabled={true}
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

