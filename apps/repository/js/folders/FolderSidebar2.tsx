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
import {createContextMenu} from "../../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import {FolderSidebarMenu} from "./FolderSidebarMenu";


// FIXME this works BUT:
//
// - nested folders aren't being expanded by default on init.
// - no context menu...

const FoldersMenu = () => <FolderSidebarMenu type="folder"/>
const TagsMenu = () => <FolderSidebarMenu type="tag"/>

const FoldersContextMenu = createContextMenu(FoldersMenu);
const TagsContextMenu = createContextMenu(TagsMenu);

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

                    <MUISearchBox2
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

            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     overflow: 'auto'
                 }}>

                {store.foldersRoot &&
                    <div style={{marginLeft: '8px'}}>
                        <FoldersContextMenu>
                            <MUITreeView root={store.foldersRoot}
                                         toggleExpanded={callbacks.toggleExpanded}
                                         selectRow={callbacks.selectRow}
                                         collapseNode={callbacks.collapseNode}
                                         expandNode={callbacks.expandNode}
                                         selected={store.selected}
                                         expanded={store.expanded}
                                         onDrop={callbacks.onDrop}
                                         />
                        </FoldersContextMenu>
                    </div>}

                <TagsContextMenu>
                    <MUITagList tags={store.tagsView}
                                selected={store.selected}
                                selectRow={callbacks.selectRow}
                                onDrop={callbacks.onDrop}/>
                </TagsContextMenu>
            </div>

        </Paper>
    )

};
