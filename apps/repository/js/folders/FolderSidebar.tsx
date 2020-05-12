import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {TreeState} from "../../../../web/js/ui/tree/TreeState";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {Tag} from "polar-shared/src/tags/Tags";
import {Strings} from 'polar-shared/src/util/Strings';
import Paper from '@material-ui/core/Paper';
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";
import {MUISearchBox2} from '../../../../web/spectron0/material-ui/MUISearchBox2';
import {useState} from "react";
import {useTagsContext} from "../persistence_layer/PersistenceLayerApp";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export interface FoldersSidebarProps {
    readonly treeState: TreeState<TagDescriptor>;
}

export interface IState {
    readonly treeState: TreeState<TagDescriptor>;
    readonly filter?: string;
}

// FIXME: react memo this including state...
export const FolderSidebar = (props: FoldersSidebarProps) => {

    return null;
    //
    // const [state, setState] = useState<IState>({
    //     filter: undefined,
    //     treeState: new TreeState(NULL_FUNCTION, NULL_FUNCTION)
    // });
    //
    // const tagsContext = useTagsContext()
    //
    // // private folderContextMenuComponents: ContextMenuComponents;
    // //
    // // private tagContextMenuComponents: ContextMenuComponents;
    //
    // const {treeState} = props;
    //
    // // this.folderContextMenuComponents
    // //     = FolderContextMenus.create({
    // //         type: 'folder',
    // //         treeState,
    // //         persistenceLayerMutator,
    // //     });
    // //
    // // this.tagContextMenuComponents
    // //     = FolderContextMenus.create({
    // //         type: 'tag',
    // //         treeState,
    // //         persistenceLayerMutator,
    // //     });
    //
    // const setFilter = (filter: string) => {
    //     setState({
    //         ...state,
    //         filter
    //     });
    // }
    //
    // const computeTags = () => {
    //
    //     const filter = state.filter || "";
    //     const tags = tagsContext?.tagsProvider() || [];
    //
    //     if (filter && ! Strings.empty(filter)) {
    //
    //         const predicate = (tag: Tag) => {
    //             return tag.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    //         };
    //
    //         return tags.filter(predicate);
    //     } else {
    //         return tags;
    //     }
    //
    // };
    //
    // const tags = computeTags();
    //
    // return (
    //
    //     <Paper square
    //            elevation={0}
    //            style={{
    //                display: 'flex' ,
    //                flexDirection: 'column',
    //                height: '100%'
    //             }}>
    //
    //         <Paper square
    //                elevation={0}
    //                className=""
    //                style={{
    //                    height: '100%',
    //                    display: 'flex' ,
    //                    flexDirection: 'column',
    //                }}>
    //
    //             {/*{this.folderContextMenuComponents.contextMenu()}*/}
    //
    //             {/*{this.tagContextMenuComponents.contextMenu()}*/}
    //
    //             <MUIPaperToolbar borderBottom
    //                              padding={0.5}>
    //                 <div style={{
    //                          display: 'flex'
    //                      }}>
    //
    //
    //                     {/*<InputFilter placeholder="Filter by tag or folder"*/}
    //                     {/*             style={{*/}
    //                     {/*                 flexGrow: 1*/}
    //                     {/*             }}*/}
    //                     {/*             onChange={value => this.setFilter(value)}/>*/}
    //
    //                     <MUISearchBox2
    //                            // type="search"
    //                            placeholder="Filter by tag or folder"
    //                            style={{
    //                                flexGrow: 1
    //                            }}
    //                            onChange={text => setFilter(text)}/>
    //
    //                     <div className="ml-1">
    //                         {/*FIXME add this back in ...*/}
    //                         {/*<AddTagsDropdown createUserTagCallback={this.folderContextMenuComponents.createUserTag}/>*/}
    //                     </div>
    //
    //                 </div>
    //             </MUIPaperToolbar>
    //
    //             <div style={{
    //                     flexGrow: 1,
    //                     overflow: 'auto',
    //                 }}>
    //
    //                 <TagTree tags={tags}
    //                          treeState={treeState}
    //                          rootTitle="Folders"
    //                          tagType='folder'
    //                          filterDisabled={true}
    //                          // nodeContextMenuRender={this.folderContextMenuComponents.render}
    //                          noCreate={true}/>
    //
    //                 <TagTree tags={tags}
    //                          treeState={treeState}
    //                          rootTitle="Tags"
    //                          tagType='regular'
    //                          filterDisabled={true}
    //                          // nodeContextMenuRender={this.tagContextMenuComponents.render}
    //                          noCreate={true}/>
    //             </div>
    //
    //         </Paper>
    //
    //     </Paper>
    // );

};
