import * as React from 'react';
import {TagTree} from '../../../../web/js/ui/tree/TagTree';
import {Tag} from "polar-shared/src/tags/Tags";
import {Strings} from 'polar-shared/src/util/Strings';
import Paper from '@material-ui/core/Paper';
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";
import {MUISearchBox2} from '../../../../web/spectron0/material-ui/MUISearchBox2';
import {useTagsContext} from "../persistence_layer/PersistenceLayerApp";
// import {useDocRepoFolderStore} from "../doc_repo/DocRepoStore2";
import MUITreeView
    from "../../../../web/spectron0/material-ui/treeview/MUITreeView";
import isEqual from "react-fast-compare";

export const FolderSidebar2 = () => <div>placeholder for sidebar</div>


// export const FolderSidebar2 = React.memo(() => {
//
//     const folderStore = useDocRepoFolderStore();
//
//     const {treeState, sidebarFilter, setSidebarFilter} = folderStore;
//
//     const tagsContext = useTagsContext()
//
//     // private folderContextMenuComponents: ContextMenuComponents;
//     //
//     // private tagContextMenuComponents: ContextMenuComponents;
//
//
//     // this.folderContextMenuComponents
//     //     = FolderContextMenus.create({
//     //         type: 'folder',
//     //         treeState,
//     //         persistenceLayerMutator,
//     //     });
//     //
//     // this.tagContextMenuComponents
//     //     = FolderContextMenus.create({
//     //         type: 'tag',
//     //         treeState,
//     //         persistenceLayerMutator,
//     //     });
//
//     const computeTags = () => {
//
//         const filter = sidebarFilter || "";
//         const tags = tagsContext?.tagsProvider() || [];
//
//         if (filter && ! Strings.empty(filter)) {
//
//             const predicate = (tag: Tag) => {
//                 return tag.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
//             };
//
//             return tags.filter(predicate);
//         } else {
//             return tags;
//         }
//
//     };
//
//     const tags = computeTags();
//
//     return (
//
//         <Paper square
//                style={{
//                    display: 'flex' ,
//                    flexDirection: 'column',
//                    height: '100%'
//                 }}>
//
//             <Paper square
//                    className=""
//                    style={{
//                        height: '100%',
//                        display: 'flex' ,
//                        flexDirection: 'column',
//                    }}>
//
//                 {/*{this.folderContextMenuComponents.contextMenu()}*/}
//
//                 {/*{this.tagContextMenuComponents.contextMenu()}*/}
//
//                 <MUIPaperToolbar borderBottom
//                                  padding={0.5}>
//                     <div style={{
//                              display: 'flex'
//                          }}>
//
//
//                         {/*<InputFilter placeholder="Filter by tag or folder"*/}
//                         {/*             style={{*/}
//                         {/*                 flexGrow: 1*/}
//                         {/*             }}*/}
//                         {/*             onChange={value => this.setFilter(value)}/>*/}
//
//                         <MUISearchBox2
//                                // type="search"
//                                placeholder="Filter by tag or folder"
//                                style={{
//                                    flexGrow: 1
//                                }}
//                                onChange={setSidebarFilter}/>
//
//                         <div className="ml-1">
//                             {/*FIXME add this back in ...*/}
//                             {/*<AddTagsDropdown createUserTagCallback={this.folderContextMenuComponents.createUserTag}/>*/}
//                         </div>
//
//                     </div>
//                 </MUIPaperToolbar>
//
//                 <div style={{
//                         flexGrow: 1,
//                         overflow: 'auto',
//                     }}>
//
//                     <MUITreeView/>
//
//                     <TagTree tags={tags}
//                              treeState={treeState}
//                              rootTitle="Folders"
//                              tagType='folder'
//                              filterDisabled={true}
//                              // nodeContextMenuRender={this.folderContextMenuComponents.render}
//                              noCreate={true}/>
//
//                     <TagTree tags={tags}
//                              treeState={treeState}
//                              rootTitle="Tags"
//                              tagType='regular'
//                              filterDisabled={true}
//                              // nodeContextMenuRender={this.tagContextMenuComponents.render}
//                              noCreate={true}/>
//                 </div>
//
//             </Paper>
//
//         </Paper>
//     );
//
// }, isEqual);
