import {BlockIDStr, IBlock} from "./IBlock";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace BlockFSCK {

    export interface IMissingChild {
        readonly id: BlockIDStr;
        readonly type: 'missing-child';
        readonly child: BlockIDStr;
    }

    export type BlockCorruption = IMissingChild;

    export function exec(blocks: ReadonlyArray<IBlock>): ReadonlyArray<BlockCorruption> {

        const lookup =
            arrayStream(blocks)
                .toMap2(current => current.id, current => current);

        const result: BlockCorruption[] = [];

        for (const block of blocks) {

            for (const child of Object.values(block.items)) {

                if (! lookup[child]) {
                    result.push(<IMissingChild> {
                        id: block.id,
                        type: 'missing-child',
                        child
                    })
                }

            }

        }

        return result;

    }


}
