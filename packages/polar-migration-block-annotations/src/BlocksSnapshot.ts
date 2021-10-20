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

        const toBlock = ({ id, content, children }: IBlockContentStructure,
                         parent: IBlock | null = null): ReadonlyArray<IBlock> => {

            const now = ISODateTimeStrings.create();

            const block: IBlock = {
                id,
                parent: parent?.id,
                parents: parent ? [...parent.parents, parent.id] : [],
                nspace: uid,
                uid,
                root: parent ? parent.root : id,
                content,
                created: now,
                updated: now,
                items: PositionalArrays.create(),
                mutation: 0,
            };

            const childrenBlocks = children.flatMap(childStructure => toBlock(childStructure, block));
            const childrenBlockIDs = childrenBlocks.map(({ id }) => id);

            return [
                { ...block, items: PositionalArrays.create(childrenBlockIDs) },
                ...childrenBlocks,
            ];
        };

        return contentStructure.flatMap(structure => toBlock(structure));

    }

}
