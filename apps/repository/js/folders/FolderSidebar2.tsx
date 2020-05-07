import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {MUITreeView} from "../../../../web/spectron0/material-ui/treeview2/MUITreeView";
import {MUITagList} from "./MUITagList";
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";
import {MUISearchBox2} from "../../../../web/spectron0/material-ui/MUISearchBox2";
import {AddTagsDropdown} from "./AddTagsDropdown";
import {
    useFolderSidebarCallbacks,
    useFolderSidebarStore
} from "../folder_sidebar/FolderSidebarStore";

// FIXME this works BUT:
//
// - nested folders aren't being expanded by default on init.
// - no context menu...

export const FolderSidebar2 = () => {

    const store = useFolderSidebarStore();
    const callbacks = useFolderSidebarCallbacks();

    return (
        <Paper square
               elevation={0}
               style={{
                   display: 'flex',
                   flexGrow: 1,
                   flexDirection: "column",
                   minHeight: 0
               }}>

            <MUIPaperToolbar borderBottom
                             padding={0.5}>
                <div style={{
                    display: 'flex'
                }}>


                    {/*<InputFilter placeholder="Filter by tag or folder"*/}
                    {/*             style={{*/}
                    {/*                 flexGrow: 1*/}
                    {/*             }}*/}
                    {/*             onChange={value => this.setFilter(value)}/>*/}

                    <MUISearchBox2
                        // type="search"
                        initialValue={store.filter}
                        placeholder="Filter by tag or folder"
                        style={{
                            flexGrow: 1
                        }}
                        onChange={callbacks.setFilter}/>

                    <div className="ml-1">
                        <AddTagsDropdown onCreateFolder={() => callbacks.onCreateUserTag('folder')}
                                         onCreateTag={() => callbacks.onCreateUserTag('tag')}/>
                    </div>

                </div>
            </MUIPaperToolbar>

            {/*FIXME: the root folder needs to have a special name of 'Folders'*/}

            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     overflow: 'auto'
                 }}>

                {store.foldersRoot &&
                    <div style={{marginLeft: '8px'}}>
                        <MUITreeView root={store.foldersRoot}
                                     toggleExpanded={callbacks.toggleExpanded}
                                     selectRow={callbacks.selectRow}
                                     collapseNode={callbacks.collapseNode}
                                     expandNode={callbacks.expandNode}
                                     selected={store.selected}
                                     expanded={store.expanded}
                                     onDrop={callbacks.onDrop}
                                     />
                    </div>}

                <MUITagList tags={store.tagsView}
                            selected={store.selected}
                            selectRow={callbacks.selectRow}
                            onDrop={callbacks.onDrop}
                            />
            </div>

        </Paper>
    )

};

export const FolderSidebar4 = () => (
    <div>disabled folder sidebar</div>
);

export const FolderSidebar5 = () => {

    const store = useFolderSidebarStore();
    const callbacks = useFolderSidebarCallbacks();


    return (
        <Paper square
               elevation={0}
               style={{
                   flexGrow: 1,
                   padding: '5px'
               }}>


            {/*{store.foldersRoot &&*/}
            {/*    <MUITreeView root={store.foldersRoot}*/}
            {/*                 toggleExpanded={callbacks.toggleExpanded}*/}
            {/*                 toggleSelected={NULL_FUNCTION}*/}
            {/*                 collapseNode={callbacks.collapseNode}*/}
            {/*                 expandNode={callbacks.expandNode}*/}
            {/*                 selected={store.selected}*/}
            {/*                 expanded={store.expanded}*/}
            {/*                 />}*/}

            {/*{store.tagsRoot &&*/}
            {/*    <MUITreeView root={store.tagsRoot}*/}
            {/*                 toggleExpanded={callbacks.toggleExpanded}*/}
            {/*                 toggleSelected={callbacks.toggleSelected}*/}
            {/*                 collapseNode={callbacks.collapseNode}*/}
            {/*                 expandNode={callbacks.expandNode}*/}
            {/*                 selected={store.selected}*/}
            {/*                 expanded={store.expanded}*/}
            {/*                 />}*/}

        </Paper>
    );
};

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
