import * as React from 'react';
import {MUITreeView} from "../../../../web/js/mui/treeview/MUITreeView";
import {MUITagList} from "./MUITagList";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {AddTagsDropdown} from "./AddTagsDropdown";
import {useFolderSidebarCallbacks, useFolderSidebarStore} from "../folder_sidebar/FolderSidebarStore";
import {createContextMenu, MenuComponentProps} from "../doc_repo/MUIContextMenu";
import {FolderSidebarMenu} from "./FolderSidebarMenu";
import {TagIDStr} from "polar-shared/src/tags/Tags";
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const useStyles = makeStyles(() =>
    createStyles({
        controlBar: {
            display: 'flex',
            alignItems: 'center',
            padding: '2px 10px'
        },
    }),
);


const FoldersMenu: React.FC<MenuComponentProps<unknown>> = (props) => <FolderSidebarMenu {...props} type="folder" />;
const TagsMenu: React.FC<MenuComponentProps<unknown>> = (props) => <FolderSidebarMenu {...props} type="tag" />;

const FoldersContextMenu = createContextMenu(FoldersMenu);
const TagsContextMenu = createContextMenu(TagsMenu);

interface IProps {
    readonly header?: JSX.Element;
}

export const FolderSidebar2 = React.memo((props: IProps) => {

    const classes = useStyles();

    const {filter, foldersRoot, selected, expanded, tagsView, isProcessing}
        = useFolderSidebarStore(['filter', 'foldersRoot', 'selected', 'expanded', 'tagsView', 'isProcessing']);

    const {onDrop, onCreateUserTag, setFilter, selectRow, collapseNode, expandNode} = useFolderSidebarCallbacks();

    const handleDrop = React.useCallback((event: React.DragEvent, tagID: TagIDStr) => {

        try {
            onDrop(tagID);
        } finally {
            event.stopPropagation();
            event.preventDefault();
        }

    }, [onDrop]);

    return (
        <MUIElevation className="FolderSidebar2"
                      elevation={2}
                      style={{
                          display: 'flex',
                          flexGrow: 1,
                          flexDirection: "column",
                          height: '100%',
                          minWidth: '100%',
                          minHeight: 0
                      }}>
            <>
                <MUIPaperToolbar borderBottom>
                    <>
                        {props.header && (
                            <div style={{
                                     display: 'flex',
                                     padding: '0 8px',
                                 }}>
                                {props.header}
                            </div>
                        )}

                        <div className={classes.controlBar}>

                            <MUISearchBox2
                                initialValue={filter}
                                placeholder="Filter by tag or folder"
                                autoComplete="off"
                                style={{
                                    flexGrow: 1,
                                }}
                                onChange={setFilter}/>

                            <div className="ml-1">
                                <AddTagsDropdown onCreateFolder={() => onCreateUserTag('folder')}
                                                 onCreateTag={() => onCreateUserTag('tag')}/>
                            </div>

                        </div>

                    </>
                </MUIPaperToolbar>

                <div style={{
                         display: 'flex',
                         flexGrow: 1,
                         flexDirection: 'column',
                         overflow: 'auto',
                         padding: 8,
                     }}>

                    {foldersRoot &&
                        <div style={{marginLeft: '8px'}}>
                            <FoldersContextMenu disabled={isProcessing}>
                                <MUITreeView root={foldersRoot}
                                             selectRow={selectRow}
                                             collapseNode={collapseNode}
                                             expandNode={expandNode}
                                             selected={selected}
                                             expanded={expanded}
                                             onDrop={handleDrop} />
                            </FoldersContextMenu>
                        </div>}

                    <TagsContextMenu disabled={isProcessing}>
                        <MUITagList tags={tagsView}
                                    selected={selected}
                                    selectRow={selectRow}
                                    onDrop={handleDrop}/>
                    </TagsContextMenu>
                </div>
            </>
        </MUIElevation>
    )

});
