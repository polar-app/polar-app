import {IBlockContentStructure, IBlock, UIDStr} from "polar-blocks/src/blocks/IBlock";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";

export namespace BlocksSnapshot {

    /**
     * Convert a block content structure to blocks snapshot
     *
     * @param uid The id of the user that owns the block
     * @param contentStructure The content structure tree of block contents that will be converted
     */
    export function blockContentStructureToBlockSnapshot(uid: UIDStr,
                                                         contentStructure: ReadonlyArray<IBlockContentStructure>): ReadonlyArray<IBlock> {

        const toBlocks = ({ id, content, children, created, updated }: IBlockContentStructure,
                         parent: IBlock | null = null): ReadonlyArray<IBlock> => {

            const now = ISODateTimeStrings.create();
            const createdTs = created || now;
            const updatedTs = updated || now;

            const directChildrenIDs = children.map(({ id }) => id);

            const block: IBlock = {
                id,
                parent: parent?.id,
                parents: parent ? [...parent.parents, parent.id] : [],
                nspace: uid,
                uid,
                root: parent ? parent.root : id,
                content,
                created: createdTs,
                updated: updatedTs,
                items: PositionalArrays.create(directChildrenIDs),
                mutation: 0,
            };

            const childrenBlocks = children.flatMap(childStructure => toBlocks(childStructure, block));

            return [
                block,
                ...childrenBlocks,
            ];
        };

        return contentStructure.flatMap(structure => toBlocks(structure));

    }

}
