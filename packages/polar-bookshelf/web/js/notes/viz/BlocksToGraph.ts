import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IBlock} from "polar-blocks/src/blocks/IBlock";

export namespace BlocksToGraph {

    export type IMetaType = {
        readonly createdAt: ISODateTimeString;
        readonly updatedAt: ISODateTimeString;
    }

    export type INodeType = {
        readonly id: string;
        readonly label: string;
        readonly meta: IMetaType;
    }

    export interface IGraphData {
        readonly nodes: ReadonlyArray<INodeType>;
        readonly edges: ReadonlyArray<IEdgeType>;
    }

    export interface IEdgeType {
        readonly source: string;
        readonly target: string;
    }

    export function computeNamedBlocks(blocks: ReadonlyArray<IBlock>) {

        return arrayStream(blocks)
            .filter(current => current.content.type === 'name')
            .collect();

    }

    export function convertBlocksToGraph(blocks: ReadonlyArray<IBlock>): IGraphData {

        const toNode = (block: IBlock) => {

            if (block.content.type === 'name') {
                return {
                    id: block.id,
                    label: block.content.data,
                    meta: {
                        createdAt: block.created,
                        updatedAt: block.updated,
                    }
                }
            }

            throw new Error("Wrong block type: " + block.content.type);

        }

        const toEdges = (block: IBlock) => {

            // TODO in this dataset... we have have all the child blocks so
            // to look these up is easy but with filtering we might have to
            // dive into the BlocksStore

            const convertFromMarkdownToEdges = (markdownBlock: IBlock): ReadonlyArray<IEdgeType> => {

                if (markdownBlock.content.type === 'markdown') {

                    return arrayStream(markdownBlock.content.links)
                        .map(current => {
                            return {
                                source: block.id,
                                target: current.id
                            };
                        })
                        .unique(current => current.target)
                        .collect();

                }

                return [];

            }

            return arrayStream(blocks)
                .filter(current => current.root === block.id)
                .filter(current => current.content.type === 'markdown')
                .map(current => convertFromMarkdownToEdges(current))
                .flatMap(current => current)
                .unique(current => current.target)
                .collect();

        }

        const nodes
            = computeNamedBlocks(blocks)
                .map(current => toNode(current));

        const edges
            = arrayStream(computeNamedBlocks(blocks))
                .map(current => toEdges(current))
                .flatMap(current => current)
                .collect();

        return {nodes, edges};

    }

}
