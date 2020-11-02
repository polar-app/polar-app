import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {MUITreeView} from "../../../../web/js/mui/treeview/MUITreeView";
import {MUITagList} from "./MUITagList";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {AddTagsDropdown} from "./AddTagsDropdown";
import {
    useFolderSidebarCallbacks,
    useFolderSidebarStore
} from "../folder_sidebar/FolderSidebarStore";
import {createContextMenu} from "../doc_repo/MUIContextMenu";
import {FolderSidebarMenu} from "./FolderSidebarMenu";
import {TagIDStr} from "polar-shared/src/tags/Tags";


const FoldersMenu = () => <FolderSidebarMenu type="folder"/>
const TagsMenu = () => <FolderSidebarMenu type="tag"/>

const FoldersContextMenu = createContextMenu(FoldersMenu);
const TagsContextMenu = createContextMenu(TagsMenu);

export const FolderSidebar2 = () => {

    const {filter, foldersRoot, selected, expanded, tagsView}
        = useFolderSidebarStore(['filter', 'foldersRoot', 'selected', 'expanded', 'tagsView']);

    const {onDrop, onCreateUserTag, setFilter, toggleExpanded, selectRow, collapseNode, expandNode} = useFolderSidebarCallbacks();

    const handleDrop = React.useCallback((event: React.DragEvent, tagID: TagIDStr) => {

        try {
            onDrop(tagID);
        } finally {
            event.stopPropagation();
            event.preventDefault();
        }

    }, [onDrop]);

    return (
        <Paper className="FolderSidebar2"
               square
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
                        initialValue={filter}
                        placeholder="Filter by tag or folder"
                        autoComplete="off"
                        style={{
                            flexGrow: 1
                        }}
                        onChange={setFilter}/>

                    <div className="ml-1">
                        <AddTagsDropdown onCreateFolder={() => onCreateUserTag('folder')}
                                         onCreateTag={() => onCreateUserTag('tag')}/>
                    </div>

                </div>
            </MUIPaperToolbar>

            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     overflow: 'auto'
                 }}>

                {foldersRoot &&
                    <div style={{marginLeft: '8px'}}>
                        <FoldersContextMenu>
                            <MUITreeView root={foldersRoot}
                                         toggleExpanded={toggleExpanded}
                                         selectRow={selectRow}
                                         collapseNode={collapseNode}
                                         expandNode={expandNode}
                                         selected={selected}
                                         expanded={expanded}
                                         onDrop={handleDrop}
                                         />
                        </FoldersContextMenu>
                    </div>}

                <TagsContextMenu>
                    <MUITagList tags={tagsView}
                                selected={selected}
                                selectRow={selectRow}
                                onDrop={handleDrop}/>
                </TagsContextMenu>
            </div>

        </Paper>
    )

};
