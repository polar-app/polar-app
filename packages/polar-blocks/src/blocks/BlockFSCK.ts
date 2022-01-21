import {BlockIDStr, IBlock} from "./IBlock";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Preconditions} from "polar-shared/src/Preconditions";

export namespace BlockFSCK {

    export interface IWrongChildPointerNotString {
        readonly id: BlockIDStr;
        readonly block: IBlock;
        readonly type: 'child-pointer-not-string';
        readonly child: any;
        readonly childKey: string;
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

            for (const [childKey, child] of Object.entries(block.items)) {

                if (typeof child !== 'string') {

                    result.push(<IWrongChildPointerNotString> {
                        id: block.id,
                        block,
                        type: 'child-pointer-not-string',
                        child,
                        childKey
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

    export interface IRepairOpts {
        readonly simulate?: boolean;
    }

    export async function repair(corruptions: ReadonlyArray<BlockCorruption>, opts: IRepairOpts = {}): Promise<ReadonlyArray<IBlock>> {

        // go through each corruption and try to repair them...

        const repairs: IBlock[] = [];

        for (const corruption of corruptions) {

            async function repairChildPointerNotString(corruption: BlockFSCK.IWrongChildPointerNotString) {

                const brokenChild = corruption.block.items[corruption.childKey];

                if (typeof brokenChild === 'object') {

                    const newChildKey = corruption.childKey + "." + Object.keys(brokenChild)[0];
                    const newChild = Object.values(brokenChild)[0] as string;

                    Preconditions.assertString(newChildKey, 'newChildKey');
                    Preconditions.assertString(newChild, 'newChild');

                    const newItems = {...corruption.block.items};

                    delete newItems[corruption.childKey];

                    newItems[newChildKey] = newChild;

                    const newBlock = {...corruption.block, items: newItems};

                    repairs.push(newBlock);

                }

            }

            switch(corruption.type) {

                case "child-pointer-not-string":
                    await repairChildPointerNotString(corruption)
                    break;

                default:
                    throw new Error("Unable to repair corruption type: " + corruption.type)

            }

        }

        return repairs;

    }

}
