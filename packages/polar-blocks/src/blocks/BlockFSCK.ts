import {BlockIDStr, IBlock} from "./IBlock";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace BlockFSCK {

    export interface IWrongChildPointerNotString {
        readonly id: BlockIDStr;
        readonly block: IBlock;
        readonly type: 'child-pointer-not-string';
        readonly child: BlockIDStr;
    }

    export interface IMissingChild {
        readonly id: BlockIDStr;
        readonly block: IBlock;
        readonly type: 'missing-child';
        readonly child: BlockIDStr;
    }

    export type BlockCorruption = IMissingChild | IWrongChildPointerNotString;

    export function exec(blocks: ReadonlyArray<IBlock>): ReadonlyArray<BlockCorruption> {

        const lookup =
            arrayStream(blocks)
                .toMap2(current => current.id, current => current);

        const result: BlockCorruption[] = [];

        for (const block of blocks) {

            for (const child of Object.values(block.items)) {

                if (typeof child !== 'string') {

                    result.push(<IWrongChildPointerNotString> {
                        id: block.id,
                        block,
                        type: 'child-pointer-not-string',
                        child
                    });

                    continue;
                }

                if (! lookup[child]) {
                    result.push(<IMissingChild> {
                        id: block.id,
                        block,
                        type: 'missing-child',
                        child
                    });
                    continue;
                }

            }

        }

        return result;

    }


}
