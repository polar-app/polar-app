import * as React from 'react';
import clsx from "clsx";
import {MUITreeView} from "../../../../web/js/mui/treeview/MUITreeView";
import {MUITagList} from "./MUITagList";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {createContextMenu, MenuComponentProps} from "../doc_repo/MUIContextMenu";
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import {Box, Button, makeStyles, createStyles} from "@material-ui/core";
import {useBlocksFolderSidebarDropHandler, useBlocksFolderSidebarStore} from "../folder_sidebar/BlocksFolderSidebarStore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {observer} from "mobx-react-lite";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useCreateBlockUserTag, useDeleteBlockUserTags, useRenameBlockUserTag} from "./BlocksTagsHooks";
import {Paths} from "polar-shared/src/util/Paths";
import {BlocksFolderSidebarMenu} from "./BlocksFolderSidebarMenu";
import {TagType} from "polar-shared/src/tags/Tags";
import {BlockIDStr} from 'polar-blocks/src/blocks/IBlock';
import {BlocksFolderSidebarSection} from './BlocksFolderSidebarSection';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: "column",
            height: '100%',
            minWidth: '100%',
            minHeight: 0,
        },
        tagsList: {
            overflowY: 'auto',
        },
        filterResetButton: {
            borderRadius: 0,
            textTransform: 'none',
            '& .MuiButton-label': {
                color: theme.palette.text.primary,
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '1.1rem',
            },
            '& .filter-reset-count': {
                color: theme.palette.text.hint,
                fontWeight: 'normal',
            },
        },
    }),
);


const FoldersMenu: React.FC<MenuComponentProps> = (props) => <BlocksFolderSidebarMenu {...props} type="folder" />;
const TagsMenu: React.FC<MenuComponentProps> = (props) => <BlocksFolderSidebarMenu {...props} type="tag" />;

const FoldersContextMenu = createContextMenu(FoldersMenu);
const TagsContextMenu = createContextMenu(TagsMenu);

interface IProps {
    readonly header?: JSX.Element;
    readonly filterResetLabel?: string;
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

export const useDeleteBlockUserTagDialog = () => {
    const dialogs = useDialogManager();
    const deleteBlockUserTag = useDeleteBlockUserTags();
    const folderSidebarStore = useBlocksFolderSidebarStore();

    return React.useCallback(() => {

        const onAccept = () => deleteBlockUserTag(folderSidebarStore.selected);

        dialogs.confirm({
            title: `Are you sure you want to delete these tags/folders?`,
            subtitle: (
                <div>
                    <p>
                        This is a permanent operation and can't be undone
                        <br />
                        This will also delete the note that's associated with this tag
                    </p>
                </div>
            ),
            onCancel: NULL_FUNCTION,
            type: 'danger',
            onAccept,
        });
    }, [dialogs, deleteBlockUserTag, folderSidebarStore]);
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

    const handleFilterReset = React.useCallback(() => folderSidebarStore.setFilter(''), [folderSidebarStore]);

    const { foldersRoot } = folderSidebarStore;

    return (
        <MUIElevation className={clsx("FolderSidebar2", classes.root)}
                      elevation={2}>
            <MUIPaperToolbar borderBottom>
                {props.header && <Box px={1} display="flex" children={props.header} />}
            </MUIPaperToolbar>

            <Box flexGrow="1" p={1} className={classes.tagsList}>
                {props.filterResetLabel && (
                    <Button color="secondary"
                            fullWidth
                            onClick={handleFilterReset}
                            classes={{ root: classes.filterResetButton }}>
                        <span>{props.filterResetLabel}</span>
                        <span className="filter-reset-count">{foldersRoot ? foldersRoot.count : ''}</span>
                    </Button>
                )}
                <BlocksFolderSidebarSection label="Folders" onAdd={handleCreateUserTag('folder')}>
                    {foldersRoot && (
                        <Box ml={1}>
                            <FoldersContextMenu>
                                {foldersRoot.children.map((item) => (
                                    <MUITreeView root={item}
                                                 key={item.id}
                                                 selectRow={handleSelectRow}
                                                 collapseNode={handleExpand(false)}
                                                 expandNode={handleExpand(true)}
                                                 selected={folderSidebarStore.selected}
                                                 expanded={folderSidebarStore.expanded}
                                                 onDrop={dropHandler} />
                                ))}
                            </FoldersContextMenu>
                        </Box>
                    )}
                </BlocksFolderSidebarSection>

                <BlocksFolderSidebarSection label="Tags" onAdd={handleCreateUserTag('tag')}>
                    <TagsContextMenu>
                        <MUITagList tags={folderSidebarStore.tagsView}
                                    selected={folderSidebarStore.selected}
                                    selectRow={handleSelectRow}
                                    onDrop={dropHandler} />
                    </TagsContextMenu>
                </BlocksFolderSidebarSection>
            </Box>
        </MUIElevation>
    );
});
