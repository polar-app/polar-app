import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Tag, TagType} from "polar-shared/src/tags/Tags";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Paths} from "polar-shared/src/util/Paths";
import React from "react";
import {NameContent} from "../../../../web/js/notes/content/NameContent";
import {BlockTextContentUtils} from "../../../../web/js/notes/NoteUtils";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {useBlocksUserTagsDB} from "../persistence_layer/BlocksUserTagsDataLoader";

export const useCreateBlockUserTag = () => {
    const blocksStore = useBlocksStore();
    const blocksUserTagsDB = useBlocksUserTagsDB();

    return React.useCallback((label: string) => {

        const getTag = (): Tag => {
            const existing = blocksStore.getBlockByName(label);

            if (existing) {
                return {
                    id: existing.id,
                    label: BlockTextContentUtils.getTextContentMarkdown(existing.content)
                };
            }

            const content = new NameContent({ type: 'name', data: label, links: [] });

            const newTagBlockContentStructure = {
                id: Hashcodes.createRandomID(),
                content,
                children: [],
            };

            blocksStore.insertFromBlockContentStructure([newTagBlockContentStructure], { isUndoable: false });
            
            return {
                id: newTagBlockContentStructure.id,
                label,
            };
        };

        const tag = getTag();

        if (! blocksUserTagsDB.exists(tag.id)) {
            blocksUserTagsDB.register(tag);
            blocksUserTagsDB.commit().catch(console.error);
        }

    }, [blocksStore, blocksUserTagsDB]);
};



// TODO: this is not ready yet
export const useDeleteBlockUserTag = () => {
    const blocksStore = useBlocksStore();
    const blocksUserTagsDB = useBlocksUserTagsDB();

    return React.useCallback((id: BlockIDStr) => {
        blocksStore.deleteBlocks([id]);

        blocksUserTagsDB.delete(id);
        blocksUserTagsDB.commit().catch(console.error);
    }, [blocksStore, blocksUserTagsDB]);
};

// TODO: this is not ready yet
export const useRenameBlockUserTag = () => {
    const blocksStore = useBlocksStore();
    const blocksUserTagsDB = useBlocksUserTagsDB();

    return React.useCallback((type: TagType) => (id: BlockIDStr, newName: string) => {
        const getRenameOps = (): ReadonlyArray<Tag> => {
            switch (type) {
                case 'tag':
                    blocksStore.renameBlock(id, newName);

                    blocksUserTagsDB.rename(id, newName);

                    return [{ id, label: newName }];

                case 'folder':
                    const tags = blocksUserTagsDB.tags();
                    const tagToBeRenamed = blocksUserTagsDB.get(id);
                    if (! tagToBeRenamed) {
                        return [];
                    }

                    const baseDir = Paths.dirname(tagToBeRenamed.label);
                    const newFolderName = Paths.create(baseDir, newName);


                    const foldersToBeRenamed = tags.filter(tag => tag.label.startsWith(tagToBeRenamed.label));
                    const children = foldersToBeRenamed.map((folder) => {
                        const newPath = folder.label.replace(tagToBeRenamed.label, newFolderName);

                        return { id: folder.id, label: newPath };
                    });

                    return [
                        { id, label: newFolderName },
                        ...children,
                    ];
            }
        };

        const doRename = ({ id, label }: Tag) => {
            blocksStore.renameBlock(id, label);
            blocksUserTagsDB.rename(id, label);
        };

        const renameOps = getRenameOps();

        renameOps.forEach(doRename);
        blocksUserTagsDB.commit().catch(console.error);
    }, [blocksStore, blocksUserTagsDB]);
};
