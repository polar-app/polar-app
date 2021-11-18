import * as React from 'react';
import clsx from "clsx";
import {MUITreeView} from "../../../../web/js/mui/treeview/MUITreeView";
import {MUITagList} from "./MUITagList";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {AddTagsDropdown} from "./AddTagsDropdown";
import {createContextMenu, MenuComponentProps} from "../doc_repo/MUIContextMenu";
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {Box} from "@material-ui/core";
import {useBlocksFolderSidebarDropHandler, useBlocksFolderSidebarStore} from "../folder_sidebar/BlocksFolderSidebarStore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {observer} from "mobx-react-lite";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useCreateBlockUserTag, useRenameBlockUserTag} from "./BlocksTagsHooks";
import {Paths} from "polar-shared/src/util/Paths";
import {BlocksFolderSidebarMenu} from "./BlocksFolderSidebarMenu";
import {TagType} from "polar-shared/src/tags/Tags";
import {BlockIDStr} from 'polar-blocks/src/blocks/IBlock';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: "column",
            height: '100%',
            minWidth: '100%',
            minHeight: 0,
        },
        controlBar: {
            display: 'flex',
            alignItems: 'center',
            padding: '2px 10px'
        },
    }),
);


const FoldersMenu: React.FC<MenuComponentProps> = (props) => <BlocksFolderSidebarMenu {...props} type="folder" />;
const TagsMenu: React.FC<MenuComponentProps> = (props) => <BlocksFolderSidebarMenu {...props} type="tag" />;

const FoldersContextMenu = createContextMenu(FoldersMenu);
const TagsContextMenu = createContextMenu(TagsMenu);

interface IProps {
    readonly header?: JSX.Element;
}

export const useCreateBlockUserTagDialog = () => {
    const dialogs = useDialogManager();
    const createBlockUserTag = useCreateBlockUserTag();
    const folderSidebarStore = useBlocksFolderSidebarStore();
    
    return React.useCallback((type: TagType) => () => {
        const getLabel = (text: string): string => {
            switch (type) {
                case "tag":
                    return text;
                case "folder":
                    const selectedTags = folderSidebarStore.selectedTags;
                    const parent = selectedTags.length > 0 ? selectedTags[0].label : '/';
                    return Paths.create(parent, text);
            }
        };

        const onDone = (text: string) => createBlockUserTag(getLabel(text));

        dialogs.prompt({
            title: "Create new " + type,
            autoFocus: true,
            onCancel: NULL_FUNCTION,
            onDone,
        });
    }, [dialogs, folderSidebarStore, createBlockUserTag]);
};

export const useRenameBlockUserTagDialog = () => {
    const dialogs = useDialogManager();
    const renameBlockUserTag = useRenameBlockUserTag();
    const folderSidebarStore = useBlocksFolderSidebarStore();
    
    return React.useCallback((type: TagType) => () => {
        const tagToBeRenamed = folderSidebarStore.selectedTags[0];

        if (! tagToBeRenamed) {
            return;
        }

        const onDone = (text: string) => renameBlockUserTag(type)(tagToBeRenamed.id, text);

        dialogs.prompt({
            title: `Rename ${type} ${Paths.basename(tagToBeRenamed.label)}`,
            autoFocus: true,
            onCancel: NULL_FUNCTION,
            onDone,
        });
    }, [dialogs, folderSidebarStore, renameBlockUserTag]);
};

export const BlocksFolderSidebar: React.FC<IProps> = observer((props) => {

    const classes = useStyles();

    const folderSidebarStore = useBlocksFolderSidebarStore();
    const folderSidebarDropHandler = useBlocksFolderSidebarDropHandler();
    const handleCreateUserTag = useCreateBlockUserTagDialog();

    const dropHandler = React.useCallback((_: React.DragEvent, tagID: BlockIDStr) =>
        folderSidebarDropHandler(tagID), [folderSidebarDropHandler]);

    const handleSelectRow = React.useCallback((...args: Parameters<typeof folderSidebarStore.selectRow>) =>
        folderSidebarStore.selectRow(...args), [folderSidebarStore]);

    const handleExpand = React.useCallback((state: boolean) => (id: BlockIDStr) =>
        state ? folderSidebarStore.expandNode(id) : folderSidebarStore.collapseNode(id), [folderSidebarStore]);

    const handleSetFilter = React.useCallback((filter: string) => folderSidebarStore.setFilter(filter), [folderSidebarStore]);

    return (
        <MUIElevation className={clsx("FolderSidebar2", classes.root)}
                      elevation={2}>
            <MUIPaperToolbar borderBottom>
                {props.header && <Box px={1} display="flex" children={props.header} />}

                <div className={classes.controlBar}>

                    <MUISearchBox2
                        initialValue={folderSidebarStore.filter}
                        placeholder="Filter by tag or folder"
                        autoComplete="off"
                        style={{ flexGrow: 1 }}
                        onChange={handleSetFilter}/>

                    <div className="ml-1">
                        <AddTagsDropdown onCreateFolder={handleCreateUserTag('folder')}
                                         onCreateTag={handleCreateUserTag('tag')}/>
                    </div>

                </div>

            </MUIPaperToolbar>

            <Box display="flex" flexGrow="1" flexDirection="column" p={1}>
                {folderSidebarStore.foldersRoot && (
                    <Box ml={1}>
                        <FoldersContextMenu>
                            <MUITreeView root={folderSidebarStore.foldersRoot}
                                         selectRow={handleSelectRow}
                                         collapseNode={handleExpand(false)}
                                         expandNode={handleExpand(true)}
                                         selected={folderSidebarStore.selected}
                                         expanded={folderSidebarStore.expanded}
                                         onDrop={dropHandler} />
                        </FoldersContextMenu>
                    </Box>
                )}

                <TagsContextMenu>
                    <MUITagList tags={folderSidebarStore.tagsView}
                                selected={folderSidebarStore.selected}
                                selectRow={handleSelectRow}
                                onDrop={dropHandler} />
                </TagsContextMenu>
            </Box>
        </MUIElevation>
    );
});
