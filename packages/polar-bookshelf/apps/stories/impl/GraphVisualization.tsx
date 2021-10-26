import React, {useEffect, useRef, useState} from "react";
import G6, {Graph} from "@antv/g6";
import {SimpleDialog} from "./SimpleDialog";
import {MockBlocks} from "./MockBlocks";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlocksToGraph} from "../../../web/js/notes/viz/BlocksToGraph";
import {IBlock} from "polar-blocks/src/blocks/IBlock";

// TOO: how do we pick the center of the layout

interface IGraphVisualizationInnerProps {
    readonly width: number;
    readonly height: number;
    readonly blocks: ReadonlyArray<IBlock>;
}


const COLORS = {
    gray100: "#e2e2e2",
    babyblue: "#0089e4",
    violet: "#7a6ae6",
    violet100: "#5549a0"
}

type MetaType = {
    readonly createdAt: ISODateTimeString;
    readonly updatedAt: ISODateTimeString;
}

// type NodeType = {
//     id: string;
//     label: string;
//     meta: MetaType
// } & StateStyles

type NodeType = {
    readonly id: string;
    readonly label: string;
    readonly meta: MetaType
}

export interface IGraphData {
    readonly nodes: ReadonlyArray<NodeType>;
    readonly edges: ReadonlyArray<IEdgeType>;
}

export interface IEdgeType {
    readonly source: string;
    readonly target: string;
}

export const GraphVisualizationInner = (props: IGraphVisualizationInnerProps) => {

    const ref = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<MetaType | null>(null);
    const blocksGraph = React.useMemo(() => BlocksToGraph.convertBlocksToGraph(props.blocks), [props.blocks]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedValue(null);
    };

    useEffect(() => {

        let graph: Graph | null = null;

        const MINIMAP_HEIGHT = 100;

        if (!graph) {

            const minimap = new G6.Minimap({height: MINIMAP_HEIGHT});

            graph = new G6.Graph({
                container: ref.current,
                width: props.width,
                height: props.height - MINIMAP_HEIGHT,
                modes: {
                    default: ["drag-canvas", "drag-node", "zoom-canvas"],
                },
                plugins: [minimap],
                animate: true,
                defaultNode: {
                    style: {
                    lineWidth: 2,
                    stroke: COLORS.gray100,
                    fill: COLORS.gray100,
                    cursor: "grab"
                    },
                    labelCfg: {
                        position: 'bottom',
                        offset: 10,
                        style: {
                            fill: COLORS.gray100
                        }
                    },
                    defaultEdge: {
                        size: 1,
                        color: COLORS.gray100,
                        style: {
                            endArrow: {
                                path: 'M 0,0 L 8,4 L 8,-4 Z',
                                fill: '#e2e2e2',
                            },
                        },
                    },
                    layout: {
                        type: "force",
                        gpuEnabled: true,
                        workerEnabled: true,
                        // clustering: true,
                        gravity: 20,
                        speed: 10,
                        maxIteration: 500,
                        // for rendering after each iteration
                        tick: () => {
                            if (graph) {
                                graph.refreshPositions()
                            }
                        }
                    },
                    nodeStateStyles: {
                        hover: {
                            cursor: "grab",
                            stroke: COLORS.babyblue,
                            lineWidth: 2,
                        },
                    },
                }
            });
        }

        // nodes.forEach(
        //     (node) => {
        //         switch (node.cluster) {
        //             case "b": {
        //                 node.size = 40;
        //                 node.style = {
        //                     fill: COLORS.violet,
        //                 };
        //                 break;
        //             }
        //             case "c": {
        //                 node.size = 30;
        //                 node.style = {
        //                     fill:  COLORS.violet100,
        //                 };
        //                 break;
        //             }
        //         }
        //     }
        // );

        console.log("FIXME: edges: ", blocksGraph.edges);

        graph.data(blocksGraph as any);
        graph.render();

        graph.on("node:mouseenter", (evt) => graph?.setItemState(evt.item!, "hover", true));
        graph.on("node:mouseleave", (evt) => graph?.setItemState(evt.item!, "hover", false));

        graph.on("node:click", (evt) => {
            const item = evt.item?.getModel().meta as MetaType
            if (item) {
                setSelectedValue(item)
                handleClickOpen()
            }
        });

        return () => {
            if (graph) {
                graph.destroy()
            }
        }

    }, [blocksGraph, blocksGraph.nodes, props.height, props.width]);

    return (
        <div ref={ref}>
            <SimpleDialog open={open} onClose={handleClose}>
                <li>{selectedValue?.createdAt}</li>
                <li>{selectedValue?.updatedAt}</li>
            </SimpleDialog>
        </div>
    );
};

export const GraphVisualization = () => {
    return (
        <GraphVisualizationInner  width={800} height={600} blocks={MockBlocks.create()}/>
    );

    // return (
    //     <ContainerDimensions>
    //         {({height, width}) => <GraphVisualizationInner height={height} width={width}/>}
    //     </ContainerDimensions>
    // );
};
