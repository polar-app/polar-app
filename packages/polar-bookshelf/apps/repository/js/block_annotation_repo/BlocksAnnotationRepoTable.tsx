import {Box, createStyles, makeStyles, Table, TableBody, TableContainer, TableRow} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {Numbers} from "polar-shared/src/util/Numbers";
import React from "react";
import {BlockComponentProps, HiddenBlockComponentProps, IntersectionList, VisibleComponentProps} from "../../../../web/js/intersection_list/IntersectionList";
import {createContextMenu} from "../doc_repo/MUIContextMenu2";
import {BlocksAnnotationRepoTableMenu} from "./BlocksAnnotationRepoContextMenu";
import {IRepoAnnotationContent, useBlocksAnnotationRepoStore} from "./BlocksAnnotationRepoStore";
import {BlocksAnnotationRepoTableRow, useFixedHeightBlockAnnotationCalculator} from "./BlocksAnnotationRepoTableRow";


const VisibleComponent = (props: VisibleComponentProps<IBlock<IRepoAnnotationContent>>) => {
    const { index, value } = props;

    return (
        <BlocksAnnotationRepoTableRow key={value.id}
                                      viewIndex={index}
                                      rowSelected={true}
                                      block={value} />
    );

};

const BlockComponent = React.memo(function BlockComponent(props: BlockComponentProps<IBlock<IRepoAnnotationContent>>) {

    const fixedHeightAnnotationCalculator = useFixedHeightBlockAnnotationCalculator();

    const height = Numbers.sum(...props.values.map(current => fixedHeightAnnotationCalculator(current)));

    return (
        <TableBody ref={props.innerRef}
                   style={{ height, minHeight: height, flexGrow: 1 }}
                   children={props.children} />
    );

});

const HiddenBlockComponent = (props: HiddenBlockComponentProps<IBlock<IRepoAnnotationContent>>) => {

    const fixedHeightAnnotationCalculator = useFixedHeightBlockAnnotationCalculator();

    const height = Numbers.sum(...props.values.map(current => fixedHeightAnnotationCalculator(current)));

    return <TableRow style={{ minHeight: `${height}px`, height: `${height}px` }} />;

};

export const [BlocksAnnotationRepoTableContextMenu, useBlocksAnnotationRepoTableContextMenu]
    = createContextMenu(BlocksAnnotationRepoTableMenu, {name: 'annotation-repo2'});

const useBlocksAnnotationRepoTableStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            minHeight: 0,
        },
        table: {
            overflowX: 'hidden',
        }
    }),
);

export const BlocksAnnotationRepoTable = React.memo(observer(function BlocksAnnotationRepoTable() {

    const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
    const classes = useBlocksAnnotationRepoTableStyles();
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();

    const highlightBlocks = blocksAnnotationRepoStore.view;

    return (
        <Box display="flex" flexDirection="column" className={classes.root}>

            <TableContainer className={classes.table} ref={setRoot}>

                {root && (
                    <Table stickyHeader
                           aria-labelledby="tableTitle"
                           size="medium"
                           aria-label="enhanced table">

                            <IntersectionList values={highlightBlocks}
                                              root={root}
                                              blockSize={10}
                                              BlockComponent={BlockComponent}
                                              HiddenBlockComponent={HiddenBlockComponent}
                                              VisibleComponent={VisibleComponent} />
                    </Table>
                )}
            </TableContainer>

        </Box>
    );
}));
